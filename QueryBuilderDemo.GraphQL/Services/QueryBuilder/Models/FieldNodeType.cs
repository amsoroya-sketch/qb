namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

/// <summary>
/// Enumeration of field node types in the parsed field tree.
/// </summary>
public enum FieldNodeType
{
    /// <summary>
    /// Scalar field (e.g., firstName, budget, id).
    /// Represents a primitive or value type property.
    /// </summary>
    Scalar,

    /// <summary>
    /// Single navigation property (e.g., department, organisation, role).
    /// Represents a reference to another entity (ManyToOne).
    /// </summary>
    Navigation,

    /// <summary>
    /// Collection navigation property (e.g., employees, projects, tasks).
    /// Represents a collection of related entities (OneToMany or ManyToMany).
    /// </summary>
    Collection
}
