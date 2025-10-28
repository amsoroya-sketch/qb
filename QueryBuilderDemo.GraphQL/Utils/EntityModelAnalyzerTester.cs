using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.GraphQL.Services.QueryBuilder;
using QueryBuilderDemo.Tests.Data;

namespace QueryBuilderDemo.GraphQL.Utils;

/// <summary>
/// Utility class for testing the EntityModelAnalyzer during development.
/// </summary>
public static class EntityModelAnalyzerTester
{
    /// <summary>
    /// Tests the EntityModelAnalyzer by retrieving and displaying metadata.
    /// </summary>
    public static void Test(IServiceProvider serviceProvider)
    {
        Console.WriteLine("=== Entity Model Analyzer Test ===\n");

        var analyzer = serviceProvider.GetRequiredService<IEntityModelAnalyzer>();

        // Test 1: Get all entity names
        Console.WriteLine("1. All Entities in Model:");
        var entityNames = analyzer.GetAllEntityNames();
        foreach (var entityName in entityNames.OrderBy(e => e))
        {
            Console.WriteLine($"   - {entityName}");
        }
        Console.WriteLine($"   Total: {entityNames.Count} entities\n");

        // Test 2: Get Employee metadata
        Console.WriteLine("2. Employee Entity Metadata:");
        var employeeMetadata = analyzer.GetEntityMetadata("Employee");
        Console.WriteLine($"   Name: {employeeMetadata.Name}");
        Console.WriteLine($"   CLR Type: {employeeMetadata.ClrType.FullName}");
        Console.WriteLine($"   Scalar Properties ({employeeMetadata.ScalarProperties.Count}):");
        foreach (var prop in employeeMetadata.ScalarProperties)
        {
            var pkMarker = prop.IsPrimaryKey ? " [PK]" : "";
            var nullMarker = prop.IsNullable ? "?" : "";
            Console.WriteLine($"      - {prop.Name}: {prop.PropertyType.Name}{nullMarker}{pkMarker}");
        }
        Console.WriteLine($"   Navigation Properties ({employeeMetadata.NavigationProperties.Count}):");
        foreach (var nav in employeeMetadata.NavigationProperties)
        {
            var collectionMarker = nav.IsCollection ? "[]" : "";
            Console.WriteLine($"      - {nav.Name} -> {nav.TargetEntityName}{collectionMarker} ({nav.NavigationType})");
        }
        Console.WriteLine();

        // Test 3: Validate field paths
        Console.WriteLine("3. Field Path Validation:");
        var testPaths = new[]
        {
            ("Employee", "firstName", true),
            ("Employee", "department.name", true),
            ("Employee", "department.organisation.name", true),
            ("Employee", "role.title", true),
            ("Employee", "invalidField", false),
            ("Employee", "department.invalidField", false),
            ("InvalidEntity", "field", false)
        };

        foreach (var (entity, path, expectedValid) in testPaths)
        {
            var isValid = analyzer.IsValidFieldPath(entity, path);
            var status = isValid == expectedValid ? "✓" : "✗";
            Console.WriteLine($"   {status} IsValidFieldPath(\"{entity}\", \"{path}\") = {isValid}");
        }
        Console.WriteLine();

        // Test 4: Entity existence
        Console.WriteLine("4. Entity Existence Check:");
        var entityChecks = new[] { "Employee", "Department", "Organisation", "InvalidEntity" };
        foreach (var entity in entityChecks)
        {
            var exists = analyzer.EntityExists(entity);
            var status = exists ? "✓" : "✗";
            Console.WriteLine($"   {status} EntityExists(\"{entity}\") = {exists}");
        }
        Console.WriteLine();

        // Test 5: Department metadata (to show relationships)
        Console.WriteLine("5. Department Entity Metadata:");
        var deptMetadata = analyzer.GetEntityMetadata("Department");
        Console.WriteLine($"   Name: {deptMetadata.Name}");
        Console.WriteLine($"   Navigation Properties:");
        foreach (var nav in deptMetadata.NavigationProperties)
        {
            var collectionMarker = nav.IsCollection ? "[]" : "";
            var inverse = nav.InversePropertyName != null ? $" (inverse: {nav.InversePropertyName})" : "";
            Console.WriteLine($"      - {nav.Name} -> {nav.TargetEntityName}{collectionMarker} ({nav.NavigationType}){inverse}");
        }
        Console.WriteLine();

        Console.WriteLine("=== Test Completed Successfully ===");
    }
}
