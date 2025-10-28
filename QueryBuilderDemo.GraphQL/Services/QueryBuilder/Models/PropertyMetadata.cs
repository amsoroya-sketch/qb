namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

/// <summary>
/// Metadata for a scalar property of an entity.
/// </summary>
public class PropertyMetadata
{
    /// <summary>
    /// Gets the property name.
    /// </summary>
    public required string Name { get; init; }

    /// <summary>
    /// Gets the CLR type of the property.
    /// </summary>
    public required Type PropertyType { get; init; }

    /// <summary>
    /// Gets a value indicating whether the property is nullable.
    /// </summary>
    public required bool IsNullable { get; init; }

    /// <summary>
    /// Gets a value indicating whether this property is part of the primary key.
    /// </summary>
    public required bool IsPrimaryKey { get; init; }
}
