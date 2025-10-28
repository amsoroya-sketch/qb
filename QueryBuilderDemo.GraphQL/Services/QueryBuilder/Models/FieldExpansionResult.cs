namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

/// <summary>
/// Represents the result of expanding a wildcard field specification.
/// Contains either the expanded fields or an error message if expansion failed.
/// </summary>
public class FieldExpansionResult
{
    /// <summary>
    /// Gets the list of expanded field nodes.
    /// Empty if expansion failed.
    /// </summary>
    public IReadOnlyList<FieldNode> ExpandedFields { get; init; } = Array.Empty<FieldNode>();

    /// <summary>
    /// Gets a value indicating whether the expansion was successful.
    /// </summary>
    public bool Success { get; init; }

    /// <summary>
    /// Gets the error message if expansion failed.
    /// Null if successful.
    /// </summary>
    public string? ErrorMessage { get; init; }

    /// <summary>
    /// Creates a successful expansion result.
    /// </summary>
    /// <param name="expandedFields">The expanded field nodes.</param>
    /// <returns>A successful result with the expanded fields.</returns>
    public static FieldExpansionResult CreateSuccess(IReadOnlyList<FieldNode> expandedFields)
    {
        return new FieldExpansionResult
        {
            ExpandedFields = expandedFields,
            Success = true,
            ErrorMessage = null
        };
    }

    /// <summary>
    /// Creates a failed expansion result.
    /// </summary>
    /// <param name="errorMessage">The error message describing why expansion failed.</param>
    /// <returns>A failed result with the error message.</returns>
    public static FieldExpansionResult CreateFailure(string errorMessage)
    {
        return new FieldExpansionResult
        {
            ExpandedFields = Array.Empty<FieldNode>(),
            Success = false,
            ErrorMessage = errorMessage
        };
    }
}
