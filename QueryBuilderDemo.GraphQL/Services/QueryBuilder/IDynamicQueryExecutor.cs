using QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder;

/// <summary>
/// Service for building and executing dynamic LINQ queries with database-level flattening.
/// All operations (JOIN, SELECT, WHERE, ORDER BY) execute at the database level.
/// Returns flattened results as dictionaries with path-based field names.
/// </summary>
public interface IDynamicQueryExecutor
{
    /// <summary>
    /// Builds a dynamic LINQ query that returns flattened results.
    /// All operations (JOIN, SELECT, WHERE, ORDER BY) execute at database level.
    /// Returns IQueryable of dynamic objects. Use extension method ToFlattened() to convert to dictionaries.
    /// </summary>
    /// <param name="entityName">Root entity name (e.g., "Employee")</param>
    /// <param name="selection">Parsed field selection from FieldSpecificationParser</param>
    /// <returns>IQueryable of dynamic anonymous types (still queryable for filtering/sorting)</returns>
    /// <exception cref="ArgumentException">Thrown when entityName is null or empty</exception>
    /// <exception cref="ArgumentNullException">Thrown when selection is null</exception>
    /// <exception cref="InvalidOperationException">Thrown when entity does not exist or query building fails</exception>
    IQueryable BuildQuery(string entityName, ParsedFieldSelection selection);

    /// <summary>
    /// Builds and executes a dynamic query with optional filtering, sorting, and pagination.
    /// All operations execute at database level (not in memory).
    /// </summary>
    /// <param name="entityName">Root entity name (e.g., "Employee")</param>
    /// <param name="selection">Parsed field selection from FieldSpecificationParser</param>
    /// <param name="whereClause">Optional WHERE clause in Dynamic LINQ format (e.g., "Department.Budget >= 1000000")</param>
    /// <param name="orderByClause">Optional ORDER BY clause in Dynamic LINQ format (e.g., "LastName, FirstName")</param>
    /// <param name="take">Optional limit on number of rows to return</param>
    /// <returns>Result containing queryable and execution metadata</returns>
    /// <exception cref="ArgumentException">Thrown when entityName is null or empty</exception>
    /// <exception cref="ArgumentNullException">Thrown when selection is null</exception>
    /// <exception cref="InvalidOperationException">Thrown when query building or validation fails</exception>
    DynamicQueryResult BuildAndExecute(
        string entityName,
        ParsedFieldSelection selection,
        string? whereClause = null,
        string? orderByClause = null,
        int? take = null);
}
