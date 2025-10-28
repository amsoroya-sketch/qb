namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

/// <summary>
/// Metadata for a navigation property (relationship) of an entity.
/// </summary>
public class NavigationPropertyMetadata : PropertyMetadata
{
    /// <summary>
    /// Gets the name of the target entity type.
    /// </summary>
    public required string TargetEntityName { get; init; }

    /// <summary>
    /// Gets the type of navigation (OneToMany, ManyToOne, ManyToMany).
    /// </summary>
    public required NavigationType NavigationType { get; init; }

    /// <summary>
    /// Gets the inverse navigation property name, if it exists.
    /// </summary>
    public string? InversePropertyName { get; init; }

    /// <summary>
    /// Gets a value indicating whether this navigation represents a collection.
    /// </summary>
    public required bool IsCollection { get; init; }
}

/// <summary>
/// Enumeration of navigation property types.
/// </summary>
public enum NavigationType
{
    /// <summary>
    /// One-to-many relationship (e.g., Department has many Employees)
    /// </summary>
    OneToMany,

    /// <summary>
    /// Many-to-one relationship (e.g., Employee belongs to one Department)
    /// </summary>
    ManyToOne,

    /// <summary>
    /// Many-to-many relationship (e.g., Employee can have many Skills)
    /// </summary>
    ManyToMany
}
