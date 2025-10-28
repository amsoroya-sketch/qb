namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

/// <summary>
/// Represents the result of parsing field specifications for an entity.
/// Contains the expanded field tree with all resolved paths.
/// Immutable after construction.
/// </summary>
public class ParsedFieldSelection
{
    /// <summary>
    /// Gets the root entity name for which fields were parsed.
    /// </summary>
    public required string EntityName { get; init; }

    /// <summary>
    /// Gets the parsed and expanded field nodes.
    /// </summary>
    public required IReadOnlyList<FieldNode> Fields { get; init; }

    /// <summary>
    /// Gets the maximum allowed nesting depth for wildcard expansion.
    /// </summary>
    public required int MaxDepth { get; init; }

    /// <summary>
    /// Gets the actual maximum depth reached during parsing.
    /// This may be less than MaxDepth if the field structure is shallower.
    /// </summary>
    public required int ActualDepth { get; init; }

    /// <summary>
    /// Gets the total number of fields (including nested fields).
    /// </summary>
    public int TotalFieldCount => CountFields(Fields);

    /// <summary>
    /// Recursively counts all fields in the tree.
    /// </summary>
    private static int CountFields(IReadOnlyList<FieldNode> nodes)
    {
        var count = nodes.Count;
        foreach (var node in nodes)
        {
            if (node.HasChildren)
            {
                count += CountFields(node.Children!);
            }
        }
        return count;
    }

    /// <summary>
    /// Returns a string representation of the parsed field selection.
    /// </summary>
    public override string ToString()
    {
        return $"{EntityName}: {Fields.Count} root fields, {TotalFieldCount} total fields, depth {ActualDepth}/{MaxDepth}";
    }
}
