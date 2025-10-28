namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

/// <summary>
/// Represents the result of building a dynamic query.
/// Contains the queryable result, execution metadata, and optionally materialized results.
/// Immutable after construction.
/// </summary>
public class DynamicQueryResult
{
    /// <summary>
    /// Gets the queryable result that can be further composed with filtering/sorting/pagination.
    /// This is the primary result - use this for database-level operations.
    /// Contains dynamic anonymous types - convert to Dictionary using helper methods after materialization.
    /// </summary>
    public required IQueryable Query { get; init; }

    /// <summary>
    /// Gets the materialized results (if the query was executed).
    /// Null if the query was not executed, only built.
    /// </summary>
    public List<Dictionary<string, object?>>? MaterializedResults { get; init; }

    /// <summary>
    /// Gets the total count of results (if counting was performed).
    /// Useful for pagination scenarios.
    /// </summary>
    public int? TotalCount { get; init; }

    /// <summary>
    /// Gets the generated Dynamic LINQ SELECT clause for debugging/logging.
    /// Example: "new { FirstName as firstName, Department.Name as department_name }"
    /// </summary>
    public required string GeneratedSelectClause { get; init; }

    /// <summary>
    /// Gets the generated WHERE clause (if filtering was applied).
    /// Example: "Department.Budget >= 1000000"
    /// </summary>
    public string? GeneratedWhereClause { get; init; }

    /// <summary>
    /// Gets the generated ORDER BY clause (if sorting was applied).
    /// Example: "LastName ASC, FirstName ASC"
    /// </summary>
    public string? GeneratedOrderByClause { get; init; }

    /// <summary>
    /// Gets the number of rows to take (if limit was applied).
    /// </summary>
    public int? TakeLimit { get; init; }

    /// <summary>
    /// Returns a string representation of the query result.
    /// </summary>
    public override string ToString()
    {
        var parts = new List<string>
        {
            $"SELECT: {GeneratedSelectClause}"
        };

        if (!string.IsNullOrWhiteSpace(GeneratedWhereClause))
            parts.Add($"WHERE: {GeneratedWhereClause}");

        if (!string.IsNullOrWhiteSpace(GeneratedOrderByClause))
            parts.Add($"ORDER BY: {GeneratedOrderByClause}");

        if (TakeLimit.HasValue)
            parts.Add($"TAKE: {TakeLimit}");

        if (MaterializedResults != null)
            parts.Add($"Results: {MaterializedResults.Count} rows");
        else if (TotalCount.HasValue)
            parts.Add($"Total: {TotalCount} rows");

        return string.Join(" | ", parts);
    }
}
