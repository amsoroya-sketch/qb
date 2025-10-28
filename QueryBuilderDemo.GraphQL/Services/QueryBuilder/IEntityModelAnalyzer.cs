using QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder;

/// <summary>
/// Analyzes EF Core model to extract entity metadata for dynamic query building.
/// Thread-safe singleton with cached metadata.
/// </summary>
public interface IEntityModelAnalyzer
{
    /// <summary>
    /// Gets metadata for the specified entity.
    /// Case-insensitive entity name lookup.
    /// </summary>
    /// <param name="entityName">The name of the entity (CLR type name).</param>
    /// <returns>The entity metadata.</returns>
    /// <exception cref="ArgumentException">Thrown when entityName is null or empty.</exception>
    /// <exception cref="InvalidOperationException">Thrown when entity is not found in model.</exception>
    EntityMetadata GetEntityMetadata(string entityName);

    /// <summary>
    /// Determines whether an entity with the specified name exists in the model.
    /// Case-insensitive entity name lookup.
    /// </summary>
    /// <param name="entityName">The name of the entity to check.</param>
    /// <returns>True if the entity exists; otherwise, false.</returns>
    bool EntityExists(string entityName);

    /// <summary>
    /// Validates if a field path is valid for the given entity.
    /// Supports dot-notation for nested properties (e.g., "department.organisation.name").
    /// Case-insensitive field name lookup.
    /// </summary>
    /// <param name="entityName">The root entity name.</param>
    /// <param name="fieldPath">The field path to validate (e.g., "firstName" or "department.name").</param>
    /// <returns>True if the field path is valid; otherwise, false.</returns>
    bool IsValidFieldPath(string entityName, string fieldPath);

    /// <summary>
    /// Gets a list of all entity names in the model.
    /// </summary>
    /// <returns>A read-only list of entity names.</returns>
    IReadOnlyList<string> GetAllEntityNames();
}
