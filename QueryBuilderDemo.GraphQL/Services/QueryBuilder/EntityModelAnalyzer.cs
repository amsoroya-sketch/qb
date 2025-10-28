using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;
using QueryBuilderDemo.Tests.Data;

namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder;

/// <summary>
/// Implementation of <see cref="IEntityModelAnalyzer"/> that introspects EF Core model metadata.
/// Thread-safe singleton with eager metadata caching at initialization.
/// </summary>
public class EntityModelAnalyzer : IEntityModelAnalyzer
{
    private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
    private readonly ILogger<EntityModelAnalyzer> _logger;
    private readonly ConcurrentDictionary<string, EntityMetadata> _metadataCache;
    private readonly HashSet<string> _circularReferenceDetector;

    /// <summary>
    /// Initializes a new instance of the <see cref="EntityModelAnalyzer"/> class.
    /// Eagerly builds and caches metadata for all entities in the model.
    /// </summary>
    /// <param name="contextFactory">The DbContext factory for creating temporary contexts.</param>
    /// <param name="logger">The logger instance.</param>
    /// <exception cref="ArgumentNullException">Thrown when any parameter is null.</exception>
    public EntityModelAnalyzer(
        IDbContextFactory<ApplicationDbContext> contextFactory,
        ILogger<EntityModelAnalyzer> logger)
    {
        _contextFactory = contextFactory ?? throw new ArgumentNullException(nameof(contextFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _metadataCache = new ConcurrentDictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);
        _circularReferenceDetector = new HashSet<string>();

        // Eager initialization: build cache at construction time
        InitializeCache();
    }

    /// <inheritdoc/>
    public EntityMetadata GetEntityMetadata(string entityName)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            throw new ArgumentException("Entity name cannot be null or empty", nameof(entityName));

        if (_metadataCache.TryGetValue(entityName, out var metadata))
        {
            _logger.LogTrace("Retrieved cached metadata for entity '{EntityName}'", entityName);
            return metadata;
        }

        throw new InvalidOperationException($"Entity '{entityName}' not found in model");
    }

    /// <inheritdoc/>
    public bool EntityExists(string entityName)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            return false;

        return _metadataCache.ContainsKey(entityName);
    }

    /// <inheritdoc/>
    public bool IsValidFieldPath(string entityName, string fieldPath)
    {
        if (string.IsNullOrWhiteSpace(fieldPath))
            return false;

        try
        {
            var metadata = GetEntityMetadata(entityName);
            var parts = fieldPath.Split('.');

            // Traverse the path and validate each part
            var currentMetadata = metadata;
            foreach (var part in parts)
            {
                if (!currentMetadata.HasProperty(part))
                {
                    _logger.LogTrace(
                        "Invalid field path '{FieldPath}' for entity '{EntityName}': property '{Part}' not found",
                        fieldPath, entityName, part);
                    return false;
                }

                // If this is a navigation property, navigate to the target entity
                if (currentMetadata.IsNavigationProperty(part))
                {
                    var targetEntityName = currentMetadata.GetNavigationTargetType(part);
                    currentMetadata = GetEntityMetadata(targetEntityName);
                }
            }

            _logger.LogTrace("Valid field path '{FieldPath}' for entity '{EntityName}'", fieldPath, entityName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogTrace(ex,
                "Exception validating field path '{FieldPath}' for entity '{EntityName}'",
                fieldPath, entityName);
            return false;
        }
    }

    /// <inheritdoc/>
    public IReadOnlyList<string> GetAllEntityNames()
    {
        return _metadataCache.Keys.ToList();
    }

    /// <summary>
    /// Initializes the metadata cache by analyzing all entity types in the EF Core model.
    /// This runs once at construction time to ensure fast lookups during runtime.
    /// </summary>
    private void InitializeCache()
    {
        _logger.LogInformation("Initializing entity metadata cache...");

        try
        {
            using var context = _contextFactory.CreateDbContext();
            var entityTypes = context.Model.GetEntityTypes();

            var entityCount = 0;
            foreach (var entityType in entityTypes)
            {
                try
                {
                    var metadata = BuildMetadata(entityType);
                    _metadataCache.TryAdd(entityType.ClrType.Name, metadata);
                    entityCount++;

                    _logger.LogDebug(
                        "Cached metadata for entity '{EntityName}': {ScalarCount} scalar properties, {NavigationCount} navigation properties",
                        entityType.ClrType.Name,
                        metadata.ScalarProperties.Count,
                        metadata.NavigationProperties.Count);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex,
                        "Failed to build metadata for entity '{EntityName}'",
                        entityType.ClrType.Name);
                    throw;
                }
            }

            _logger.LogInformation(
                "Successfully initialized entity metadata cache with {EntityCount} entities",
                entityCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initialize entity metadata cache");
            throw;
        }
    }

    /// <summary>
    /// Builds metadata for a single entity type by analyzing its properties and relationships.
    /// </summary>
    /// <param name="entityType">The EF Core entity type to analyze.</param>
    /// <returns>The constructed entity metadata.</returns>
    private EntityMetadata BuildMetadata(IEntityType entityType)
    {
        var scalarProperties = new List<PropertyMetadata>();
        var navigationProperties = new List<NavigationPropertyMetadata>();
        var propertyLookup = new Dictionary<string, PropertyMetadata>(StringComparer.OrdinalIgnoreCase);

        // Build scalar properties
        var properties = entityType.GetProperties();
        foreach (var property in properties)
        {
            // Skip shadow properties (properties that don't exist in the CLR type)
            if (property.IsShadowProperty())
                continue;

            var propertyMetadata = new PropertyMetadata
            {
                Name = property.Name,
                PropertyType = property.ClrType,
                IsNullable = property.IsNullable,
                IsPrimaryKey = property.IsKey()
            };

            scalarProperties.Add(propertyMetadata);
            propertyLookup[property.Name] = propertyMetadata;
        }

        // Build navigation properties
        var navigations = entityType.GetNavigations();
        foreach (var navigation in navigations)
        {
            var navigationType = DetermineNavigationType(navigation);

            var navigationMetadata = new NavigationPropertyMetadata
            {
                Name = navigation.Name,
                PropertyType = navigation.ClrType,
                IsNullable = !navigation.ForeignKey.IsRequired,
                IsPrimaryKey = false,
                TargetEntityName = navigation.TargetEntityType.ClrType.Name,
                NavigationType = navigationType,
                InversePropertyName = navigation.Inverse?.Name,
                IsCollection = navigation.IsCollection
            };

            navigationProperties.Add(navigationMetadata);
            propertyLookup[navigation.Name] = navigationMetadata;
        }

        // Build skip navigations (many-to-many)
        var skipNavigations = entityType.GetSkipNavigations();
        foreach (var skipNavigation in skipNavigations)
        {
            var skipNavigationMetadata = new NavigationPropertyMetadata
            {
                Name = skipNavigation.Name,
                PropertyType = skipNavigation.ClrType,
                IsNullable = false,
                IsPrimaryKey = false,
                TargetEntityName = skipNavigation.TargetEntityType.ClrType.Name,
                NavigationType = NavigationType.ManyToMany,
                InversePropertyName = skipNavigation.Inverse?.Name,
                IsCollection = true
            };

            navigationProperties.Add(skipNavigationMetadata);
            propertyLookup[skipNavigation.Name] = skipNavigationMetadata;
        }

        return new EntityMetadata
        {
            Name = entityType.ClrType.Name,
            ClrType = entityType.ClrType,
            ScalarProperties = scalarProperties.AsReadOnly(),
            NavigationProperties = navigationProperties.AsReadOnly(),
            PropertyLookup = propertyLookup
        };
    }

    /// <summary>
    /// Determines the navigation type based on EF Core navigation metadata.
    /// </summary>
    /// <param name="navigation">The navigation property to analyze.</param>
    /// <returns>The navigation type.</returns>
    private NavigationType DetermineNavigationType(INavigation navigation)
    {
        // Check if this is a collection navigation (one-to-many from source perspective)
        if (navigation.IsCollection)
        {
            return NavigationType.OneToMany;
        }

        // If not a collection, it's a reference navigation (many-to-one)
        return NavigationType.ManyToOne;
    }
}
