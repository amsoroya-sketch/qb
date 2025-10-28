namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

/// <summary>
/// Represents a node in the parsed field specification tree.
/// Each node can be a scalar field or a navigation property with child nodes.
/// Immutable after construction.
/// </summary>
public class FieldNode
{
    /// <summary>
    /// Gets the name of the field (e.g., "firstName", "department").
    /// </summary>
    public required string Name { get; init; }

    /// <summary>
    /// Gets the full path from the root entity (e.g., "department.organisation.name").
    /// For root-level fields, this is the same as Name.
    /// </summary>
    public required string FullPath { get; init; }

    /// <summary>
    /// Gets the type of field (Scalar, Navigation, or Collection).
    /// </summary>
    public required FieldNodeType Type { get; init; }

    /// <summary>
    /// Gets the child nodes for navigation properties.
    /// Null for scalar fields, populated for navigation/collection properties.
    /// </summary>
    public IReadOnlyList<FieldNode>? Children { get; init; }

    /// <summary>
    /// Gets a value indicating whether this is a scalar field.
    /// </summary>
    public bool IsScalar => Type == FieldNodeType.Scalar;

    /// <summary>
    /// Gets a value indicating whether this is a navigation property (single reference).
    /// </summary>
    public bool IsNavigation => Type == FieldNodeType.Navigation;

    /// <summary>
    /// Gets a value indicating whether this is a collection navigation property.
    /// </summary>
    public bool IsCollection => Type == FieldNodeType.Collection;

    /// <summary>
    /// Gets a value indicating whether this node has child nodes.
    /// </summary>
    public bool HasChildren => Children != null && Children.Count > 0;

    /// <summary>
    /// Gets the depth of this node in the tree (0 for root-level fields).
    /// </summary>
    public int Depth => FullPath.Split('.').Length - 1;

    /// <summary>
    /// Returns a string representation of this field node.
    /// </summary>
    public override string ToString()
    {
        var childInfo = HasChildren ? $" ({Children!.Count} children)" : "";
        return $"{FullPath} ({Type}){childInfo}";
    }
}
