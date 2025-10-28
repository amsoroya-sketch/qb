using QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

namespace QueryBuilderDemo.GraphQL.Services.QueryBuilder;

/// <summary>
/// Parses user field specifications and expands wildcards into complete field trees.
/// Supports dot-notation paths, wildcard expansion, and circular reference detection.
/// </summary>
public interface IFieldSpecificationParser
{
    /// <summary>
    /// Parses field specifications and expands wildcards.
    /// </summary>
    /// <param name="entityName">The root entity name.</param>
    /// <param name="fieldSpecs">
    /// Array of field specifications. Can include:
    /// - Scalar fields: "firstName", "budget"
    /// - Nested scalars: "department.name", "role.title"
    /// - Wildcards: "department" (expands to all department fields + nested entities)
    /// </param>
    /// <param name="maxDepth">Maximum nesting depth for wildcard expansion (default: 5).</param>
    /// <returns>The parsed field selection with expanded tree.</returns>
    /// <exception cref="ArgumentException">Thrown when entityName or fieldSpecs are invalid.</exception>
    /// <exception cref="InvalidOperationException">Thrown when entity is not found or max depth is exceeded.</exception>
    /// <example>
    /// Example 1: Simple scalar
    /// Input: ["firstName"]
    /// Output: FieldNode { Name: "firstName", FullPath: "firstName", Type: Scalar }
    ///
    /// Example 2: Nested scalar
    /// Input: ["role.title"]
    /// Output: FieldNode { Name: "role", Type: Navigation, Children: [
    ///     FieldNode { Name: "title", FullPath: "role.title", Type: Scalar }
    /// ]}
    ///
    /// Example 3: Wildcard expansion
    /// Input: ["department"]
    /// Output: FieldNode { Name: "department", Type: Navigation, Children: [
    ///     FieldNode { Name: "id", FullPath: "department.id", Type: Scalar },
    ///     FieldNode { Name: "name", FullPath: "department.name", Type: Scalar },
    ///     ... all department fields including nested entities
    /// ]}
    /// </example>
    ParsedFieldSelection Parse(string entityName, string[] fieldSpecs, int maxDepth = 5);

    /// <summary>
    /// Expands a wildcard field path to include all nested fields.
    /// Detects and stops at circular references.
    /// </summary>
    /// <param name="entityName">The root entity name.</param>
    /// <param name="fieldPath">The field path to expand (e.g., "department").</param>
    /// <param name="maxDepth">Maximum nesting depth (default: 5).</param>
    /// <returns>The expansion result with expanded fields or error message.</returns>
    /// <example>
    /// Input: entityName="Employee", fieldPath="department", maxDepth=5
    /// Output: All department fields (id, name, budget, head) + nested organisation fields
    ///
    /// Circular reference handling:
    /// Employee → Department → Employees (STOP HERE - circular detected)
    /// </example>
    FieldExpansionResult ExpandWildcard(string entityName, string fieldPath, int maxDepth = 5);
}
