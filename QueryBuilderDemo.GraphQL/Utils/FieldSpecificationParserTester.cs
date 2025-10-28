using QueryBuilderDemo.GraphQL.Services.QueryBuilder;
using QueryBuilderDemo.GraphQL.Services.QueryBuilder.Models;

namespace QueryBuilderDemo.GraphQL.Utils;

/// <summary>
/// Utility class for testing the FieldSpecificationParser during development.
/// </summary>
public static class FieldSpecificationParserTester
{
    /// <summary>
    /// Tests the FieldSpecificationParser with various field specifications.
    /// </summary>
    public static void Test(IServiceProvider serviceProvider)
    {
        Console.WriteLine("\n=== Field Specification Parser Test ===\n");

        var parser = serviceProvider.GetRequiredService<IFieldSpecificationParser>();

        // Test 1: Parse simple scalar fields
        Console.WriteLine("Test 1: Parse simple scalar fields");
        Console.WriteLine("Input: [\"firstName\", \"lastName\", \"email\"]");
        try
        {
            var result1 = parser.Parse("Employee", new[] { "firstName", "lastName", "email" }, maxDepth: 5);
            Console.WriteLine("Result:");
            PrintFieldTree(result1.Fields, indent: 1);
            Console.WriteLine($"Summary: {result1}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 2: Parse nested scalar field
        Console.WriteLine("Test 2: Parse nested scalar field");
        Console.WriteLine("Input: [\"role.title\"]");
        try
        {
            var result2 = parser.Parse("Employee", new[] { "role.title" }, maxDepth: 5);
            Console.WriteLine("Result:");
            PrintFieldTree(result2.Fields, indent: 1);
            Console.WriteLine($"Summary: {result2}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 3: Parse wildcard expansion (single level)
        Console.WriteLine("Test 3: Parse wildcard expansion");
        Console.WriteLine("Input: [\"role\"]");
        try
        {
            var result3 = parser.Parse("Employee", new[] { "role" }, maxDepth: 2);
            Console.WriteLine("Result:");
            PrintFieldTree(result3.Fields, indent: 1);
            Console.WriteLine($"Summary: {result3}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 4: Parse wildcard with deep nesting
        Console.WriteLine("Test 4: Parse wildcard with deep nesting");
        Console.WriteLine("Input: [\"department\"] (maxDepth: 3)");
        try
        {
            var result4 = parser.Parse("Employee", new[] { "department" }, maxDepth: 3);
            Console.WriteLine("Result:");
            PrintFieldTree(result4.Fields, indent: 1);
            Console.WriteLine($"Summary: {result4}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 5: Parse mixed fields (scalars + wildcards + nested)
        Console.WriteLine("Test 5: Parse mixed fields");
        Console.WriteLine("Input: [\"firstName\", \"lastName\", \"department.name\", \"role.title\"]");
        try
        {
            var result5 = parser.Parse("Employee",
                new[] { "firstName", "lastName", "department.name", "role.title" },
                maxDepth: 5);
            Console.WriteLine("Result:");
            PrintFieldTree(result5.Fields, indent: 1);
            Console.WriteLine($"Summary: {result5}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 6: Test circular reference detection
        Console.WriteLine("Test 6: Circular reference detection");
        Console.WriteLine("Input: [\"department\"] (maxDepth: 5 - should detect Employee -> Department -> Employees)");
        try
        {
            var result6 = parser.Parse("Employee", new[] { "department" }, maxDepth: 5);
            Console.WriteLine("Result:");
            PrintFieldTree(result6.Fields, indent: 1, maxDisplayDepth: 4);
            Console.WriteLine($"Summary: {result6}");
            Console.WriteLine("Note: Circular references should be detected and expansion stopped.\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 7: Test max depth enforcement
        Console.WriteLine("Test 7: Max depth enforcement");
        Console.WriteLine("Input: [\"department\"] (maxDepth: 1 - should limit depth)");
        try
        {
            var result7 = parser.Parse("Employee", new[] { "department" }, maxDepth: 1);
            Console.WriteLine("Result:");
            PrintFieldTree(result7.Fields, indent: 1);
            Console.WriteLine($"Summary: {result7}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 8: Test ExpandWildcard method directly
        Console.WriteLine("Test 8: Test ExpandWildcard method directly");
        Console.WriteLine("Input: entityName=\"Employee\", fieldPath=\"department\", maxDepth=2");
        try
        {
            var result8 = parser.ExpandWildcard("Employee", "department", maxDepth: 2);
            if (result8.Success)
            {
                Console.WriteLine("Result: SUCCESS");
                PrintFieldTree(result8.ExpandedFields, indent: 1, maxDisplayDepth: 3);
            }
            else
            {
                Console.WriteLine($"Result: FAILED - {result8.ErrorMessage}");
            }
            Console.WriteLine();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 9: Test invalid field specification
        Console.WriteLine("Test 9: Test invalid field specification");
        Console.WriteLine("Input: [\"invalidField\"]");
        try
        {
            var result9 = parser.Parse("Employee", new[] { "invalidField" }, maxDepth: 5);
            Console.WriteLine("Result:");
            PrintFieldTree(result9.Fields, indent: 1);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Result: EXPECTED ERROR - {ex.Message}\n");
        }

        // Test 10: Test invalid entity
        Console.WriteLine("Test 10: Test invalid entity");
        Console.WriteLine("Input: entityName=\"InvalidEntity\", fields=[\"field\"]");
        try
        {
            var result10 = parser.Parse("InvalidEntity", new[] { "field" }, maxDepth: 5);
            Console.WriteLine("Result:");
            PrintFieldTree(result10.Fields, indent: 1);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Result: EXPECTED ERROR - {ex.Message}\n");
        }

        // Test 11: Test deep nested path
        Console.WriteLine("Test 11: Test deep nested path");
        Console.WriteLine("Input: [\"department.organisation.name\"]");
        try
        {
            var result11 = parser.Parse("Employee", new[] { "department.organisation.name" }, maxDepth: 5);
            Console.WriteLine("Result:");
            PrintFieldTree(result11.Fields, indent: 1);
            Console.WriteLine($"Summary: {result11}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        // Test 12: Test complex mixed scenario
        Console.WriteLine("Test 12: Complex mixed scenario");
        Console.WriteLine("Input: [\"id\", \"firstName\", \"lastName\", \"department\", \"role.title\", \"role.description\"]");
        try
        {
            var result12 = parser.Parse("Employee",
                new[] { "id", "firstName", "lastName", "department", "role.title", "role.description" },
                maxDepth: 2);
            Console.WriteLine("Result:");
            PrintFieldTree(result12.Fields, indent: 1, maxDisplayDepth: 3);
            Console.WriteLine($"Summary: {result12}\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"ERROR: {ex.Message}\n");
        }

        Console.WriteLine("=== Test Completed Successfully ===");
    }

    /// <summary>
    /// Prints a field tree in a hierarchical format.
    /// </summary>
    private static void PrintFieldTree(IReadOnlyList<FieldNode> nodes, int indent = 0, int maxDisplayDepth = 10, int currentDepth = 0)
    {
        if (currentDepth >= maxDisplayDepth)
        {
            Console.WriteLine($"{GetIndent(indent)}... (max display depth reached)");
            return;
        }

        foreach (var node in nodes)
        {
            var typeSymbol = node.Type switch
            {
                FieldNodeType.Scalar => "•",
                FieldNodeType.Navigation => "→",
                FieldNodeType.Collection => "[]",
                _ => "?"
            };

            var childInfo = node.HasChildren ? $" ({node.Children!.Count} children)" : "";
            Console.WriteLine($"{GetIndent(indent)}{typeSymbol} {node.Name} ({node.Type}){childInfo}");

            if (node.HasChildren && currentDepth < maxDisplayDepth - 1)
            {
                PrintFieldTree(node.Children!, indent + 1, maxDisplayDepth, currentDepth + 1);
            }
            else if (node.HasChildren && currentDepth >= maxDisplayDepth - 1)
            {
                Console.WriteLine($"{GetIndent(indent + 1)}... ({node.Children!.Count} children not shown)");
            }
        }
    }

    /// <summary>
    /// Gets the indentation string for the specified level.
    /// </summary>
    private static string GetIndent(int level)
    {
        return new string(' ', level * 2);
    }
}
