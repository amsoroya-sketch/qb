using System.Linq.Dynamic.Core;
using System.Text;
using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;
using QueryBuilderDemo.Tests.Data;

namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder;

/// <summary>
/// Implementation of <see cref="IDynamicQueryExecutor"/> that builds and executes dynamic LINQ queries.
/// All operations (JOIN, SELECT, WHERE, ORDER BY) are executed at the database level.
/// Thread-safe scoped service.
/// </summary>
public class DynamicQueryExecutor : IDynamicQueryExecutor
{
    private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
    private readonly IEntityModelAnalyzer _modelAnalyzer;
    private readonly ILogger<DynamicQueryExecutor> _logger;

    // Security: whitelist of allowed operators for WHERE clauses
    private static readonly HashSet<string> DangerousPatterns = new(StringComparer.OrdinalIgnoreCase)
    {
        ";", "--", "/*", "*/", "xp_", "sp_", "DROP", "DELETE", "TRUNCATE", "ALTER", "EXEC", "EXECUTE"
    };

    /// <summary>
    /// Initializes a new instance of the <see cref="DynamicQueryExecutor"/> class.
    /// </summary>
    /// <param name="contextFactory">The DbContext factory for creating temporary contexts.</param>
    /// <param name="modelAnalyzer">The entity model analyzer for metadata lookups.</param>
    /// <param name="logger">The logger instance.</param>
    /// <exception cref="ArgumentNullException">Thrown when any parameter is null.</exception>
    public DynamicQueryExecutor(
        IDbContextFactory<ApplicationDbContext> contextFactory,
        IEntityModelAnalyzer modelAnalyzer,
        ILogger<DynamicQueryExecutor> logger)
    {
        _contextFactory = contextFactory ?? throw new ArgumentNullException(nameof(contextFactory));
        _modelAnalyzer = modelAnalyzer ?? throw new ArgumentNullException(nameof(modelAnalyzer));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc/>
    public IQueryable BuildQuery(string entityName, ParsedFieldSelection selection)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            throw new ArgumentException("Entity name cannot be null or empty", nameof(entityName));

        if (selection == null)
            throw new ArgumentNullException(nameof(selection));

        _logger.LogDebug("Building dynamic query for entity '{EntityName}' with {FieldCount} fields",
            entityName, selection.Fields.Count);

        // Validate entity exists
        if (!_modelAnalyzer.EntityExists(entityName))
            throw new InvalidOperationException($"Entity '{entityName}' not found in model");

        // Flatten the field tree to get all scalar fields
        var scalarFields = FlattenToScalarFields(selection.Fields);

        _logger.LogDebug("Flattened {TotalFields} fields to {ScalarCount} scalar fields",
            selection.TotalFieldCount, scalarFields.Count);

        if (scalarFields.Count == 0)
            throw new InvalidOperationException("No scalar fields found in selection. At least one scalar field is required.");

        // Build the Dynamic LINQ SELECT clause
        var selectClause = BuildSelectClause(scalarFields);

        _logger.LogDebug("Generated SELECT clause: {SelectClause}", selectClause);

        // Get DbSet for the entity
        var context = _contextFactory.CreateDbContext();
        var dbSet = GetDbSet(context, entityName);

        // Build the query using Dynamic LINQ
        // Dynamic LINQ returns IQueryable of anonymous types
        var dynamicQuery = dbSet.Select(selectClause);

        // Log generated SQL in development
        if (_logger.IsEnabled(LogLevel.Debug))
        {
            try
            {
                var sql = dynamicQuery.ToQueryString();
                _logger.LogDebug("Generated SQL:\n{SQL}", sql);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to generate SQL string for logging");
            }
        }

        // Return the IQueryable - caller will convert to Dictionary after materialization
        return dynamicQuery;
    }

    /// <inheritdoc/>
    public DynamicQueryResult BuildAndExecute(
        string entityName,
        ParsedFieldSelection selection,
        string? whereClause = null,
        string? orderByClause = null,
        int? take = null)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            throw new ArgumentException("Entity name cannot be null or empty", nameof(entityName));

        if (selection == null)
            throw new ArgumentNullException(nameof(selection));

        // Validate WHERE clause
        if (!string.IsNullOrWhiteSpace(whereClause))
        {
            ValidateWhereClause(whereClause);
        }

        // Validate ORDER BY clause
        if (!string.IsNullOrWhiteSpace(orderByClause))
        {
            ValidateOrderByClause(orderByClause);
        }

        _logger.LogDebug("Building dynamic query with filters for entity '{EntityName}'", entityName);

        // Validate entity exists
        if (!_modelAnalyzer.EntityExists(entityName))
            throw new InvalidOperationException($"Entity '{entityName}' not found in model");

        // Flatten the field tree to get all scalar fields
        var scalarFields = FlattenToScalarFields(selection.Fields);

        if (scalarFields.Count == 0)
            throw new InvalidOperationException("No scalar fields found in selection. At least one scalar field is required.");

        // Build the Dynamic LINQ SELECT clause
        var selectClause = BuildSelectClause(scalarFields);

        // Get DbSet for the entity
        var context = _contextFactory.CreateDbContext();
        var dbSet = GetDbSet(context, entityName);

        // Apply WHERE clause FIRST (on the entity source)
        IQueryable baseQuery = dbSet;
        if (!string.IsNullOrWhiteSpace(whereClause))
        {
            _logger.LogDebug("Applying WHERE clause: {WhereClause}", whereClause);
            baseQuery = baseQuery.Where(whereClause);
        }

        // Apply ORDER BY clause (on the entity source)
        if (!string.IsNullOrWhiteSpace(orderByClause))
        {
            _logger.LogDebug("Applying ORDER BY clause: {OrderByClause}", orderByClause);
            baseQuery = baseQuery.OrderBy(orderByClause);
        }

        // Apply TAKE limit (on the entity source)
        if (take.HasValue)
        {
            if (take.Value < 1)
                throw new ArgumentException("Take value must be greater than 0", nameof(take));

            _logger.LogDebug("Applying TAKE limit: {Take}", take.Value);
            baseQuery = baseQuery.Take(take.Value);
        }

        // NOW apply the SELECT projection (after filtering/sorting/limiting)
        var projectedQuery = baseQuery.Select(selectClause);

        // Log final SQL
        if (_logger.IsEnabled(LogLevel.Debug))
        {
            try
            {
                var sql = projectedQuery.ToQueryString();
                _logger.LogDebug("Final SQL with filters:\n{SQL}", sql);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to generate SQL string for logging");
            }
        }

        return new DynamicQueryResult
        {
            Query = projectedQuery,
            MaterializedResults = null, // Not materialized, caller can do this
            TotalCount = null,
            GeneratedSelectClause = selectClause,
            GeneratedWhereClause = whereClause,
            GeneratedOrderByClause = orderByClause,
            TakeLimit = take
        };
    }

    /// <summary>
    /// Flattens a field node tree to get all scalar fields with their full paths.
    /// Recursively traverses navigation properties to find all leaf scalar fields.
    /// Skips collection navigation properties.
    /// </summary>
    private List<FieldNode> FlattenToScalarFields(IReadOnlyList<FieldNode> fields)
    {
        var result = new List<FieldNode>();

        foreach (var field in fields)
        {
            if (field.IsScalar)
            {
                // This is a scalar field, add it
                result.Add(field);
            }
            else if (field.IsCollection)
            {
                // Skip collections - they would cause cartesian products
                _logger.LogWarning("Skipping collection field '{FieldPath}' - collections not supported in flattening",
                    field.FullPath);
                continue;
            }
            else if (field.HasChildren)
            {
                // This is a navigation property with children, recurse
                result.AddRange(FlattenToScalarFields(field.Children!));
            }
            else
            {
                // Navigation property without children (not expanded)
                _logger.LogWarning("Navigation field '{FieldPath}' has no children, skipping", field.FullPath);
            }
        }

        return result;
    }

    /// <summary>
    /// Builds the Dynamic LINQ SELECT clause from scalar fields.
    /// Converts field paths to Pascal case for property access and underscore format for aliases.
    /// Example: "new { FirstName as firstName, Department.Name as department_name }"
    /// </summary>
    private string BuildSelectClause(List<FieldNode> scalarFields)
    {
        var selectPairs = new List<string>();

        foreach (var field in scalarFields)
        {
            var propertyPath = ConvertToPropertyPath(field.FullPath);
            var alias = ConvertToAlias(field.FullPath);

            selectPairs.Add($"{propertyPath} as {alias}");
        }

        return $"new {{ {string.Join(", ", selectPairs)} }}";
    }

    /// <summary>
    /// Converts a field path to a C# property path (Pascal case).
    /// Example: "firstName" → "FirstName"
    /// Example: "department.name" → "Department.Name"
    /// Example: "department.organisation.name" → "Department.Organisation.Name"
    /// </summary>
    private string ConvertToPropertyPath(string fieldPath)
    {
        var parts = fieldPath.Split('.');
        var pascalParts = parts.Select(ToPascalCase);
        return string.Join(".", pascalParts);
    }

    /// <summary>
    /// Converts a field path to an alias (underscore format for flattened names).
    /// Example: "firstName" → "firstName"
    /// Example: "department.name" → "department_name"
    /// Example: "department.organisation.name" → "department_organisation_name"
    /// </summary>
    private string ConvertToAlias(string fieldPath)
    {
        // Replace dots with underscores for flattened names
        return fieldPath.Replace(".", "_");
    }

    /// <summary>
    /// Converts a string to Pascal case.
    /// Example: "firstName" → "FirstName"
    /// Example: "department" → "Department"
    /// </summary>
    private string ToPascalCase(string str)
    {
        if (string.IsNullOrEmpty(str))
            return str;

        return char.ToUpper(str[0]) + str.Substring(1);
    }

    /// <summary>
    /// Gets the DbSet for the specified entity name.
    /// </summary>
    private IQueryable GetDbSet(ApplicationDbContext context, string entityName)
    {
        var metadata = _modelAnalyzer.GetEntityMetadata(entityName);
        var entityType = metadata.ClrType;

        // Try to get DbSet property by name (pluralized)
        var pluralName = entityName + "s";
        var dbSetProperty = context.GetType().GetProperty(pluralName);

        if (dbSetProperty == null)
        {
            // Try singular name
            dbSetProperty = context.GetType().GetProperty(entityName);
        }

        if (dbSetProperty == null)
        {
            throw new InvalidOperationException(
                $"DbSet not found for entity '{entityName}'. Tried '{pluralName}' and '{entityName}'.");
        }

        var dbSet = dbSetProperty.GetValue(context);
        if (dbSet == null)
        {
            throw new InvalidOperationException($"DbSet for entity '{entityName}' is null");
        }

        return (IQueryable)dbSet;
    }

    /// <summary>
    /// Converts a dynamic anonymous object to Dictionary&lt;string, object?&gt;.
    /// This is a placeholder - the actual conversion happens via Dynamic LINQ projections.
    /// </summary>
    private Dictionary<string, object?> ConvertToDictionary(object obj)
    {
        if (obj == null)
            return new Dictionary<string, object?>();

        var dictionary = new Dictionary<string, object?>();
        var properties = obj.GetType().GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(obj);
            dictionary[prop.Name] = value;
        }

        return dictionary;
    }

    /// <summary>
    /// Validates a WHERE clause to prevent LINQ injection.
    /// Checks for dangerous SQL patterns and keywords.
    /// </summary>
    private void ValidateWhereClause(string whereClause)
    {
        if (string.IsNullOrWhiteSpace(whereClause))
            return;

        // Check for dangerous patterns
        foreach (var pattern in DangerousPatterns)
        {
            if (whereClause.Contains(pattern, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    $"Invalid WHERE clause: contains forbidden pattern '{pattern}'");
            }
        }

        // Additional validation: check for balanced parentheses
        var openCount = whereClause.Count(c => c == '(');
        var closeCount = whereClause.Count(c => c == ')');

        if (openCount != closeCount)
        {
            throw new InvalidOperationException(
                "Invalid WHERE clause: unbalanced parentheses");
        }

        _logger.LogDebug("WHERE clause validated successfully: {WhereClause}", whereClause);
    }

    /// <summary>
    /// Validates an ORDER BY clause to prevent LINQ injection.
    /// Checks for dangerous SQL patterns.
    /// </summary>
    private void ValidateOrderByClause(string orderByClause)
    {
        if (string.IsNullOrWhiteSpace(orderByClause))
            return;

        // Check for dangerous patterns
        foreach (var pattern in DangerousPatterns)
        {
            if (orderByClause.Contains(pattern, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    $"Invalid ORDER BY clause: contains forbidden pattern '{pattern}'");
            }
        }

        _logger.LogDebug("ORDER BY clause validated successfully: {OrderByClause}", orderByClause);
    }
}

/// <summary>
/// Extension methods for working with dynamic query results.
/// </summary>
public static class DynamicQueryExtensions
{
    /// <summary>
    /// Converts an IQueryable of dynamic objects to a list of dictionaries.
    /// This materializes the query and performs the conversion.
    /// </summary>
    public static List<Dictionary<string, object?>> ToFlattened(this IQueryable query)
    {
        var results = new List<Dictionary<string, object?>>();

        foreach (var item in query)
        {
            results.Add(ConvertToDictionary(item));
        }

        return results;
    }

    /// <summary>
    /// Converts a single dynamic object to a dictionary.
    /// </summary>
    private static Dictionary<string, object?> ConvertToDictionary(object? obj)
    {
        if (obj == null)
            return new Dictionary<string, object?>();

        var dictionary = new Dictionary<string, object?>();
        var properties = obj.GetType().GetProperties(
            System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);

        foreach (var prop in properties)
        {
            try
            {
                var value = prop.GetValue(obj, null); // Pass null for indexed properties
                dictionary[prop.Name] = value;
            }
            catch
            {
                // Skip properties that can't be read
                continue;
            }
        }

        return dictionary;
    }
}
