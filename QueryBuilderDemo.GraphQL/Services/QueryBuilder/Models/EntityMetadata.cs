using System.Collections.Concurrent;

namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

/// <summary>
/// Metadata for an entity type, including all its properties and relationships.
/// Thread-safe and immutable after initialization.
/// </summary>
public class EntityMetadata
{
    /// <summary>
    /// Gets the entity name (CLR type name).
    /// </summary>
    public required string Name { get; init; }

    /// <summary>
    /// Gets the CLR type of the entity.
    /// </summary>
    public required Type ClrType { get; init; }

    /// <summary>
    /// Gets the list of scalar (non-navigation) properties.
    /// </summary>
    public required IReadOnlyList<PropertyMetadata> ScalarProperties { get; init; }

    /// <summary>
    /// Gets the list of navigation properties (relationships).
    /// </summary>
    public required IReadOnlyList<NavigationPropertyMetadata> NavigationProperties { get; init; }

    /// <summary>
    /// Gets a fast lookup dictionary for all properties (scalar + navigation) by name.
    /// Case-insensitive key comparison.
    /// </summary>
    public required IReadOnlyDictionary<string, PropertyMetadata> PropertyLookup { get; init; }

    /// <summary>
    /// Determines whether the entity has a property with the specified name.
    /// Case-insensitive comparison.
    /// </summary>
    /// <param name="propertyName">The property name to check.</param>
    /// <returns>True if the property exists; otherwise, false.</returns>
    public bool HasProperty(string propertyName)
    {
        return PropertyLookup.ContainsKey(propertyName);
    }

    /// <summary>
    /// Determines whether the specified property is a navigation property.
    /// Case-insensitive comparison.
    /// </summary>
    /// <param name="propertyName">The property name to check.</param>
    /// <returns>True if the property is a navigation property; otherwise, false.</returns>
    public bool IsNavigationProperty(string propertyName)
    {
        return PropertyLookup.TryGetValue(propertyName, out var property)
            && property is NavigationPropertyMetadata;
    }

    /// <summary>
    /// Gets the target entity name for a navigation property.
    /// Case-insensitive comparison.
    /// </summary>
    /// <param name="navigationPropertyName">The navigation property name.</param>
    /// <returns>The target entity name.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the property is not a navigation property.</exception>
    public string GetNavigationTargetType(string navigationPropertyName)
    {
        if (PropertyLookup.TryGetValue(navigationPropertyName, out var property)
            && property is NavigationPropertyMetadata navProperty)
        {
            return navProperty.TargetEntityName;
        }

        throw new InvalidOperationException(
            $"Property '{navigationPropertyName}' is not a navigation property on entity '{Name}'");
    }

    /// <summary>
    /// Gets property metadata by name.
    /// Case-insensitive comparison.
    /// </summary>
    /// <param name="propertyName">The property name.</param>
    /// <returns>The property metadata.</returns>
    /// <exception cref="InvalidOperationException">Thrown when the property does not exist.</exception>
    public PropertyMetadata GetProperty(string propertyName)
    {
        if (PropertyLookup.TryGetValue(propertyName, out var property))
        {
            return property;
        }

        throw new InvalidOperationException(
            $"Property '{propertyName}' does not exist on entity '{Name}'");
    }
}
