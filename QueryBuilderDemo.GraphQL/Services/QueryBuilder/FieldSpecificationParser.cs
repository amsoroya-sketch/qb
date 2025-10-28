using QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder;

/// <summary>
/// Implementation of <see cref="IFieldSpecificationParser"/> that parses field specifications
/// and expands wildcards while detecting circular references.
/// Scoped service (stateless but not singleton due to transient usage patterns).
/// </summary>
public class FieldSpecificationParser : IFieldSpecificationParser
{
    private readonly IEntityModelAnalyzer _modelAnalyzer;
    private readonly ILogger<FieldSpecificationParser> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="FieldSpecificationParser"/> class.
    /// </summary>
    /// <param name="modelAnalyzer">The entity model analyzer for metadata lookups.</param>
    /// <param name="logger">The logger instance.</param>
    /// <exception cref="ArgumentNullException">Thrown when any parameter is null.</exception>
    public FieldSpecificationParser(
        IEntityModelAnalyzer modelAnalyzer,
        ILogger<FieldSpecificationParser> logger)
    {
        _modelAnalyzer = modelAnalyzer ?? throw new ArgumentNullException(nameof(modelAnalyzer));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc/>
    public ParsedFieldSelection Parse(string entityName, string[] fieldSpecs, int maxDepth = 5)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            throw new ArgumentException("Entity name cannot be null or empty", nameof(entityName));

        if (fieldSpecs == null || fieldSpecs.Length == 0)
            throw new ArgumentException("Field specifications cannot be null or empty", nameof(fieldSpecs));

        if (maxDepth < 1)
            throw new ArgumentException("Max depth must be at least 1", nameof(maxDepth));

        if (maxDepth > 10)
            throw new ArgumentException("Max depth cannot exceed 10 to prevent excessive recursion", nameof(maxDepth));

        // Validate entity exists
        if (!_modelAnalyzer.EntityExists(entityName))
            throw new InvalidOperationException($"Entity '{entityName}' not found in model");

        _logger.LogDebug("Parsing {FieldCount} field specifications for entity '{EntityName}' with max depth {MaxDepth}",
            fieldSpecs.Length, entityName, maxDepth);

        var metadata = _modelAnalyzer.GetEntityMetadata(entityName);
        var rootNodes = new List<FieldNode>();
        var actualMaxDepth = 0;

        foreach (var fieldSpec in fieldSpecs)
        {
            if (string.IsNullOrWhiteSpace(fieldSpec))
            {
                _logger.LogWarning("Skipping empty field specification");
                continue;
            }

            try
            {
                if (fieldSpec.Contains('.'))
                {
                    // Nested field: "department.name" or "department.organisation.name"
                    var node = ParseNestedField(entityName, fieldSpec, maxDepth);
                    rootNodes.Add(node);
                    actualMaxDepth = Math.Max(actualMaxDepth, node.Depth);
                }
                else
                {
                    // Root-level field: either scalar or navigation
                    if (!metadata.HasProperty(fieldSpec))
                        throw new InvalidOperationException($"Property '{fieldSpec}' does not exist on entity '{entityName}'");

                    if (metadata.IsNavigationProperty(fieldSpec))
                    {
                        // Wildcard expansion: "department" → expand all fields
                        var navMetadata = (NavigationPropertyMetadata)metadata.GetProperty(fieldSpec);
                        var expandedNode = ExpandNavigationProperty(
                            entityName,
                            fieldSpec,
                            fieldSpec,
                            navMetadata,
                            maxDepth,
                            0,
                            new HashSet<string>(StringComparer.OrdinalIgnoreCase));

                        rootNodes.Add(expandedNode);
                        actualMaxDepth = Math.Max(actualMaxDepth, CalculateDepth(expandedNode));
                    }
                    else
                    {
                        // Scalar field: "firstName"
                        var scalarNode = new FieldNode
                        {
                            Name = fieldSpec,
                            FullPath = fieldSpec,
                            Type = FieldNodeType.Scalar,
                            Children = null
                        };
                        rootNodes.Add(scalarNode);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to parse field specification '{FieldSpec}' for entity '{EntityName}'",
                    fieldSpec, entityName);
                throw;
            }
        }

        var result = new ParsedFieldSelection
        {
            EntityName = entityName,
            Fields = rootNodes.AsReadOnly(),
            MaxDepth = maxDepth,
            ActualDepth = actualMaxDepth
        };

        _logger.LogDebug("Successfully parsed {RootFieldCount} root fields with actual depth {ActualDepth} for entity '{EntityName}'",
            rootNodes.Count, actualMaxDepth, entityName);

        return result;
    }

    /// <inheritdoc/>
    public FieldExpansionResult ExpandWildcard(string entityName, string fieldPath, int maxDepth = 5)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            return FieldExpansionResult.CreateFailure("Entity name cannot be null or empty");

        if (string.IsNullOrWhiteSpace(fieldPath))
            return FieldExpansionResult.CreateFailure("Field path cannot be null or empty");

        if (maxDepth < 1)
            return FieldExpansionResult.CreateFailure("Max depth must be at least 1");

        try
        {
            // Validate entity exists
            if (!_modelAnalyzer.EntityExists(entityName))
                return FieldExpansionResult.CreateFailure($"Entity '{entityName}' not found in model");

            // Validate field path
            if (!_modelAnalyzer.IsValidFieldPath(entityName, fieldPath))
                return FieldExpansionResult.CreateFailure($"Invalid field path '{fieldPath}' for entity '{entityName}'");

            // Get the target entity for the field path
            var (targetEntityName, pathPrefix) = ResolveFieldPath(entityName, fieldPath);
            var targetMetadata = _modelAnalyzer.GetEntityMetadata(targetEntityName);

            // Expand all fields of the target entity
            var expandedFields = new List<FieldNode>();
            var visitedEntities = new HashSet<string>(StringComparer.OrdinalIgnoreCase) { entityName };

            // Add all scalar properties
            foreach (var prop in targetMetadata.ScalarProperties)
            {
                var fullPath = string.IsNullOrEmpty(pathPrefix)
                    ? prop.Name
                    : $"{pathPrefix}.{prop.Name}";

                expandedFields.Add(new FieldNode
                {
                    Name = prop.Name,
                    FullPath = fullPath,
                    Type = FieldNodeType.Scalar,
                    Children = null
                });
            }

            // Add all navigation properties (recursively if depth allows)
            foreach (var nav in targetMetadata.NavigationProperties)
            {
                var fullPath = string.IsNullOrEmpty(pathPrefix)
                    ? nav.Name
                    : $"{pathPrefix}.{nav.Name}";

                var currentDepth = fullPath.Split('.').Length - 1;

                var expandedNav = ExpandNavigationProperty(
                    targetEntityName,
                    nav.Name,
                    fullPath,
                    nav,
                    maxDepth,
                    currentDepth,
                    visitedEntities);

                expandedFields.Add(expandedNav);
            }

            return FieldExpansionResult.CreateSuccess(expandedFields.AsReadOnly());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to expand wildcard for entity '{EntityName}', field path '{FieldPath}'",
                entityName, fieldPath);
            return FieldExpansionResult.CreateFailure($"Expansion failed: {ex.Message}");
        }
    }

    /// <summary>
    /// Parses a nested field specification (e.g., "department.name" or "department.organisation.name").
    /// Builds a nested tree structure from root to leaf.
    /// </summary>
    private FieldNode ParseNestedField(string rootEntityName, string fieldPath, int maxDepth)
    {
        var parts = fieldPath.Split('.');

        // Build the tree recursively from the deepest node up
        return BuildNestedFieldNode(rootEntityName, parts, 0);
    }

    /// <summary>
    /// Recursively builds a nested field node from a path segment array.
    /// </summary>
    private FieldNode BuildNestedFieldNode(string entityName, string[] pathParts, int currentIndex)
    {
        var metadata = _modelAnalyzer.GetEntityMetadata(entityName);
        var part = pathParts[currentIndex];
        var fullPath = string.Join(".", pathParts.Take(currentIndex + 1));
        var isLastPart = currentIndex == pathParts.Length - 1;

        // Validate property exists
        if (!metadata.HasProperty(part))
            throw new InvalidOperationException($"Property '{part}' does not exist on entity '{entityName}' in path '{string.Join(".", pathParts)}'");

        if (isLastPart)
        {
            // Last part - return leaf node (scalar or navigation without expansion)
            var nodeType = metadata.IsNavigationProperty(part)
                ? (((NavigationPropertyMetadata)metadata.GetProperty(part)).IsCollection ? FieldNodeType.Collection : FieldNodeType.Navigation)
                : FieldNodeType.Scalar;

            return new FieldNode
            {
                Name = part,
                FullPath = fullPath,
                Type = nodeType,
                Children = null
            };
        }
        else
        {
            // Intermediate part - must be navigation
            if (!metadata.IsNavigationProperty(part))
                throw new InvalidOperationException($"Property '{part}' in path '{string.Join(".", pathParts)}' must be a navigation property");

            var navMetadata = (NavigationPropertyMetadata)metadata.GetProperty(part);
            var nodeType = navMetadata.IsCollection ? FieldNodeType.Collection : FieldNodeType.Navigation;

            // Recursively build child node
            var childNode = BuildNestedFieldNode(navMetadata.TargetEntityName, pathParts, currentIndex + 1);

            return new FieldNode
            {
                Name = part,
                FullPath = fullPath,
                Type = nodeType,
                Children = new[] { childNode }.ToList().AsReadOnly()
            };
        }
    }

    /// <summary>
    /// Expands a navigation property recursively, including all its fields and nested entities.
    /// Detects circular references and stops expansion when detected.
    /// </summary>
    private FieldNode ExpandNavigationProperty(
        string sourceEntityName,
        string propertyName,
        string fullPath,
        NavigationPropertyMetadata navMetadata,
        int maxDepth,
        int currentDepth,
        HashSet<string> visitedEntities)
    {
        var nodeType = navMetadata.IsCollection ? FieldNodeType.Collection : FieldNodeType.Navigation;

        // Check if we've exceeded max depth
        if (currentDepth >= maxDepth)
        {
            _logger.LogDebug("Reached max depth {MaxDepth} at path '{FullPath}', stopping expansion",
                maxDepth, fullPath);

            return new FieldNode
            {
                Name = propertyName,
                FullPath = fullPath,
                Type = nodeType,
                Children = null
            };
        }

        // Check for circular reference
        if (visitedEntities.Contains(navMetadata.TargetEntityName))
        {
            _logger.LogWarning("Circular reference detected: {SourceEntity} → {TargetEntity} at path '{FullPath}', stopping expansion",
                sourceEntityName, navMetadata.TargetEntityName, fullPath);

            return new FieldNode
            {
                Name = propertyName,
                FullPath = fullPath,
                Type = nodeType,
                Children = null
            };
        }

        // Add target entity to visited set for this path
        var newVisitedEntities = new HashSet<string>(visitedEntities, StringComparer.OrdinalIgnoreCase)
        {
            navMetadata.TargetEntityName
        };

        // Get target entity metadata
        var targetMetadata = _modelAnalyzer.GetEntityMetadata(navMetadata.TargetEntityName);
        var children = new List<FieldNode>();

        // Add all scalar properties
        foreach (var prop in targetMetadata.ScalarProperties)
        {
            children.Add(new FieldNode
            {
                Name = prop.Name,
                FullPath = $"{fullPath}.{prop.Name}",
                Type = FieldNodeType.Scalar,
                Children = null
            });
        }

        // Add all navigation properties (recursively)
        foreach (var nestedNav in targetMetadata.NavigationProperties)
        {
            var nestedFullPath = $"{fullPath}.{nestedNav.Name}";
            var nestedNode = ExpandNavigationProperty(
                navMetadata.TargetEntityName,
                nestedNav.Name,
                nestedFullPath,
                nestedNav,
                maxDepth,
                currentDepth + 1,
                newVisitedEntities);

            children.Add(nestedNode);
        }

        return new FieldNode
        {
            Name = propertyName,
            FullPath = fullPath,
            Type = nodeType,
            Children = children.AsReadOnly()
        };
    }

    /// <summary>
    /// Resolves a field path to get the target entity name and path prefix.
    /// </summary>
    private (string targetEntityName, string pathPrefix) ResolveFieldPath(string rootEntityName, string fieldPath)
    {
        if (!fieldPath.Contains('.'))
        {
            // Simple property - target is the property's target entity if navigation, else root
            var metadata = _modelAnalyzer.GetEntityMetadata(rootEntityName);
            if (metadata.IsNavigationProperty(fieldPath))
            {
                var targetEntity = metadata.GetNavigationTargetType(fieldPath);
                return (targetEntity, fieldPath);
            }
            return (rootEntityName, fieldPath);
        }

        // Nested path - resolve to the target entity
        var parts = fieldPath.Split('.');
        var currentEntityName = rootEntityName;
        var currentMetadata = _modelAnalyzer.GetEntityMetadata(currentEntityName);

        foreach (var part in parts)
        {
            if (!currentMetadata.HasProperty(part))
                throw new InvalidOperationException($"Property '{part}' does not exist on entity '{currentEntityName}'");

            if (currentMetadata.IsNavigationProperty(part))
            {
                currentEntityName = currentMetadata.GetNavigationTargetType(part);
                currentMetadata = _modelAnalyzer.GetEntityMetadata(currentEntityName);
            }
        }

        return (currentEntityName, fieldPath);
    }

    /// <summary>
    /// Calculates the maximum depth of a field node tree.
    /// </summary>
    private int CalculateDepth(FieldNode node)
    {
        if (!node.HasChildren)
            return node.Depth;

        var maxChildDepth = 0;
        foreach (var child in node.Children!)
        {
            maxChildDepth = Math.Max(maxChildDepth, CalculateDepth(child));
        }

        return maxChildDepth;
    }
}
