using HotChocolate;
using HotChocolate.Types;
using QueryBuilderDemo.GraphQL.Services.QueryBuilder;
using QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

namespace QueryBuilderDemo.GraphQL.GraphQL;

/// <summary>
/// Dynamic query endpoint that allows users to request any field combination.
/// Automatically expands wildcards and flattens results at database level.
/// All operations (JOIN, SELECT, WHERE, ORDER BY) execute in SQL.
/// </summary>
[ExtendObjectType(typeof(Query))]
public class DynamicQuery
{
    private readonly ILogger<DynamicQuery> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="DynamicQuery"/> class.
    /// </summary>
    public DynamicQuery(ILogger<DynamicQuery> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// Executes a dynamic flattened query with field specifications.
    /// Allows querying any entity with flexible field selection and automatic wildcard expansion.
    /// All filtering, sorting, and pagination happens at the database level.
    /// </summary>
    /// <param name="parser">Field specification parser service (injected)</param>
    /// <param name="executor">Dynamic query executor service (injected)</param>
    /// <param name="entity">Entity name (e.g., "Employee", "Department", "Organisation")</param>
    /// <param name="fields">Field specifications - can include scalars ("firstName"), nested paths ("department.name"), or wildcards ("department" expands all fields)</param>
    /// <param name="where">Optional WHERE clause using Dynamic LINQ syntax (e.g., "Department.Budget >= 2000000")</param>
    /// <param name="orderBy">Optional ORDER BY clause (e.g., "LastName, FirstName" or "Department.Budget DESC")</param>
    /// <param name="first">Limit number of results returned (default: no limit, max: 1000)</param>
    /// <param name="maxDepth">Maximum nesting depth for wildcard expansion (default: 3, max: 5)</param>
    /// <returns>Flattened query results with metadata</returns>
    /// <example>
    /// Query employees with department and role information:
    /// <code>
    /// {
    ///   dynamicFlat(
    ///     entity: "Employee"
    ///     fields: ["firstName", "lastName", "department.name", "role.title"]
    ///     where: "Department.Budget >= 2000000"
    ///     orderBy: "LastName, FirstName"
    ///     first: 50
    ///   ) {
    ///     data
    ///     totalCount
    ///     expandedFields
    ///     actualDepth
    ///   }
    /// }
    /// </code>
    /// </example>
    [GraphQLDescription("Dynamically query any entity with flexible field selection and automatic flattening. All operations execute at database level.")]
    public DynamicFlatResult GetDynamicFlat(
        [Service] IFieldSpecificationParser parser,
        [Service] IDynamicQueryExecutor executor,
        string entity,
        string[] fields,
        string? where = null,
        string? orderBy = null,
        int? first = null,
        int maxDepth = 3)
    {
        try
        {
            // === INPUT VALIDATION ===

            // Validate entity name
            if (string.IsNullOrWhiteSpace(entity))
            {
                _logger.LogWarning("Dynamic query failed: entity name is required");
                return new DynamicFlatResult
                {
                    Data = new List<Dictionary<string, object?>>(),
                    TotalCount = 0,
                    ExpandedFields = Array.Empty<string>(),
                    ActualDepth = 0,
                    Error = "Entity name is required"
                };
            }

            // Validate fields array
            if (fields == null || fields.Length == 0)
            {
                _logger.LogWarning("Dynamic query failed: at least one field must be specified");
                return new DynamicFlatResult
                {
                    Data = new List<Dictionary<string, object?>>(),
                    TotalCount = 0,
                    ExpandedFields = Array.Empty<string>(),
                    ActualDepth = 0,
                    Error = "At least one field must be specified"
                };
            }

            // Validate and constrain maxDepth
            if (maxDepth < 1)
            {
                _logger.LogWarning("Dynamic query failed: maxDepth must be at least 1");
                return new DynamicFlatResult
                {
                    Data = new List<Dictionary<string, object?>>(),
                    TotalCount = 0,
                    ExpandedFields = Array.Empty<string>(),
                    ActualDepth = 0,
                    Error = "maxDepth must be at least 1"
                };
            }

            if (maxDepth > 5)
            {
                _logger.LogWarning("Dynamic query: maxDepth capped at 5 (requested: {RequestedDepth})", maxDepth);
                maxDepth = 5; // Enforce maximum for performance
            }

            // Validate and constrain first (limit)
            if (first.HasValue)
            {
                if (first.Value < 1)
                {
                    _logger.LogWarning("Dynamic query failed: first must be at least 1");
                    return new DynamicFlatResult
                    {
                        Data = new List<Dictionary<string, object?>>(),
                        TotalCount = 0,
                        ExpandedFields = Array.Empty<string>(),
                        ActualDepth = 0,
                        Error = "first (limit) must be at least 1"
                    };
                }

                if (first.Value > 1000)
                {
                    _logger.LogWarning("Dynamic query: first capped at 1000 (requested: {RequestedLimit})", first.Value);
                    first = 1000; // Enforce maximum for performance
                }
            }

            _logger.LogInformation(
                "Dynamic query request: entity={Entity}, fields={FieldCount}, maxDepth={MaxDepth}, where={HasWhere}, orderBy={HasOrderBy}, first={First}",
                entity, fields.Length, maxDepth, !string.IsNullOrWhiteSpace(where), !string.IsNullOrWhiteSpace(orderBy), first);

            // === PARSE FIELD SPECIFICATIONS ===

            ParsedFieldSelection selection;
            try
            {
                selection = parser.Parse(entity, fields, maxDepth);

                _logger.LogDebug(
                    "Field parsing successful: {TotalFields} total fields, actual depth {ActualDepth}",
                    selection.TotalFieldCount, selection.ActualDepth);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Field parsing failed due to invalid argument");
                return new DynamicFlatResult
                {
                    Data = new List<Dictionary<string, object?>>(),
                    TotalCount = 0,
                    ExpandedFields = Array.Empty<string>(),
                    ActualDepth = 0,
                    Error = $"Field parsing error: {ex.Message}"
                };
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Field parsing failed due to invalid operation");
                return new DynamicFlatResult
                {
                    Data = new List<Dictionary<string, object?>>(),
                    TotalCount = 0,
                    ExpandedFields = Array.Empty<string>(),
                    ActualDepth = 0,
                    Error = $"Field parsing error: {ex.Message}"
                };
            }

            // === BUILD AND EXECUTE QUERY ===

            DynamicQueryResult queryResult;
            try
            {
                queryResult = executor.BuildAndExecute(entity, selection, where, orderBy, first);

                _logger.LogDebug("Query building successful: {SelectClause}", queryResult.GeneratedSelectClause);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Query building failed due to invalid argument");
                return new DynamicFlatResult
                {
                    Data = new List<Dictionary<string, object?>>(),
                    TotalCount = 0,
                    ExpandedFields = Array.Empty<string>(),
                    ActualDepth = 0,
                    Error = $"Query building error: {ex.Message}"
                };
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Query building failed due to invalid operation");
                return new DynamicFlatResult
                {
                    Data = new List<Dictionary<string, object?>>(),
                    TotalCount = 0,
                    ExpandedFields = Array.Empty<string>(),
                    ActualDepth = 0,
                    Error = $"Query building error: {ex.Message}"
                };
            }

            // === MATERIALIZE RESULTS ===

            List<Dictionary<string, object?>> data;
            try
            {
                // Convert IQueryable to flattened dictionaries
                // This is where database execution happens (materialization)
                data = queryResult.Query.ToFlattened();

                _logger.LogInformation(
                    "Dynamic query executed successfully: {RowCount} rows returned",
                    data.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Query execution failed during materialization");
                return new DynamicFlatResult
                {
                    Data = new List<Dictionary<string, object?>>(),
                    TotalCount = 0,
                    ExpandedFields = Array.Empty<string>(),
                    ActualDepth = 0,
                    Error = $"Query execution error: {ex.Message}"
                };
            }

            // === BUILD RESPONSE ===

            // Extract all expanded field paths from the parsed selection
            var expandedFields = ExtractAllFieldPaths(selection.Fields);

            var result = new DynamicFlatResult
            {
                Data = data,
                TotalCount = data.Count,
                ExpandedFields = expandedFields.ToArray(),
                ActualDepth = selection.ActualDepth,
                Error = null,
                GeneratedSelect = queryResult.GeneratedSelectClause
            };

            return result;
        }
        catch (Exception ex)
        {
            // Catch-all for unexpected exceptions
            _logger.LogError(ex, "Unexpected error in dynamic query execution");
            return new DynamicFlatResult
            {
                Data = new List<Dictionary<string, object?>>(),
                TotalCount = 0,
                ExpandedFields = Array.Empty<string>(),
                ActualDepth = 0,
                Error = $"Unexpected error: {ex.Message}"
            };
        }
    }

    /// <summary>
    /// Recursively extracts all field paths from a field node tree.
    /// Returns only scalar field paths (leaf nodes).
    /// </summary>
    private List<string> ExtractAllFieldPaths(IReadOnlyList<FieldNode> nodes)
    {
        var paths = new List<string>();

        foreach (var node in nodes)
        {
            if (node.IsScalar)
            {
                // This is a leaf scalar field, add its full path
                paths.Add(node.FullPath);
            }
            else if (node.HasChildren)
            {
                // This is a navigation property with children, recurse
                paths.AddRange(ExtractAllFieldPaths(node.Children!));
            }
        }

        return paths;
    }
}

/// <summary>
/// Represents the result of a dynamic flattened query.
/// Contains flattened data as dictionaries with path-based field names and metadata.
/// </summary>
public class DynamicFlatResult
{
    /// <summary>
    /// Gets the flattened query results as dictionaries.
    /// Field names use underscore notation for nested paths (e.g., "department_name", "role_title").
    /// </summary>
    [GraphQLDescription("Flattened query results with path-based field names (e.g., department_name, role_title)")]
    [GraphQLType(typeof(AnyType))]
    public required List<Dictionary<string, object?>> Data { get; init; }

    /// <summary>
    /// Gets the total count of results returned (after filtering, before pagination).
    /// </summary>
    [GraphQLDescription("Total number of results returned")]
    public required int TotalCount { get; init; }

    /// <summary>
    /// Gets the fields that were actually selected/expanded.
    /// Shows all scalar fields that are included in the result.
    /// Useful for understanding what wildcard expansion produced.
    /// </summary>
    [GraphQLDescription("Array of all fields that were expanded (useful for understanding wildcard expansion)")]
    public required string[] ExpandedFields { get; init; }

    /// <summary>
    /// Gets the maximum depth reached in field expansion.
    /// Indicates how deeply nested the query went.
    /// </summary>
    [GraphQLDescription("Maximum nesting depth reached during field expansion")]
    public required int ActualDepth { get; init; }

    /// <summary>
    /// Gets the error message if query failed.
    /// Null if query was successful.
    /// </summary>
    [GraphQLDescription("Error message if query failed, null if successful")]
    public string? Error { get; init; }

    /// <summary>
    /// Gets the generated SELECT clause for debugging.
    /// Only populated in development mode.
    /// Shows the Dynamic LINQ projection that was generated.
    /// </summary>
    [GraphQLDescription("Generated SELECT clause (for debugging in development mode)")]
    public string? GeneratedSelect { get; init; }
}
