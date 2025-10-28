using System.Linq.Dynamic.Core;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using QueryBuilderDemo.GraphQL.Services.QueryBuilder;

namespace QueryBuilderDemo.GraphQL.Utils;

/// <summary>
/// Utility for testing the DynamicQueryExecutor service.
/// Runs comprehensive tests to verify Dynamic LINQ query building and execution.
/// </summary>
public static class DynamicQueryExecutorTester
{
    /// <summary>
    /// Runs comprehensive tests on the DynamicQueryExecutor service.
    /// </summary>
    /// <param name="serviceProvider">The service provider for dependency injection.</param>
    public static void Test(IServiceProvider serviceProvider)
    {
        Console.WriteLine("\n" + new string('=', 80));
        Console.WriteLine("TESTING DYNAMIC QUERY EXECUTOR");
        Console.WriteLine(new string('=', 80) + "\n");

        using var scope = serviceProvider.CreateScope();
        var executor = scope.ServiceProvider.GetRequiredService<IDynamicQueryExecutor>();
        var parser = scope.ServiceProvider.GetRequiredService<IFieldSpecificationParser>();

        try
        {
            // Test 1: Simple flat query
            TestSimpleFlatQuery(executor, parser);

            // Test 2: Nested single level
            TestNestedSingleLevel(executor, parser);

            // Test 3: Nested multi level
            TestNestedMultiLevel(executor, parser);

            // Test 4: Multiple navigations
            TestMultipleNavigations(executor, parser);

            // Test 5: With WHERE clause
            TestWithWhereClause(executor, parser);

            // Test 6: With ORDER BY
            TestWithOrderBy(executor, parser);

            // Test 7: With TAKE limit
            TestWithTake(executor, parser);

            // Test 8: Complex query with all features
            TestComplexQuery(executor, parser);

            Console.WriteLine("\n" + new string('=', 80));
            Console.WriteLine("ALL TESTS PASSED");
            Console.WriteLine(new string('=', 80) + "\n");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"\n❌ TEST FAILED: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");
        }
    }

    private static void TestSimpleFlatQuery(IDynamicQueryExecutor executor, IFieldSpecificationParser parser)
    {
        PrintTestHeader("Test 1: Simple Flat Query");

        var fields = new[] { "firstName", "lastName" };
        var selection = parser.Parse("Employee", fields);

        var query = executor.BuildQuery("Employee", selection);
        var results = query.Take(5).ToFlattened();

        Console.WriteLine($"Fields: [{string.Join(", ", fields)}]");
        Console.WriteLine($"Results: {results.Count} rows");

        if (results.Count > 0)
        {
            var sampleRow = results[0];
            Console.WriteLine($"Sample row keys: [{string.Join(", ", sampleRow.Keys)}]");
            Console.WriteLine($"Sample data: {JsonSerializer.Serialize(sampleRow, new JsonSerializerOptions { WriteIndented = false })}");

            // Verify expected keys
            AssertContainsKey(sampleRow, "firstName", "Test 1");
            AssertContainsKey(sampleRow, "lastName", "Test 1");
        }

        Console.WriteLine("✅ PASSED\n");
    }

    private static void TestNestedSingleLevel(IDynamicQueryExecutor executor, IFieldSpecificationParser parser)
    {
        PrintTestHeader("Test 2: Nested Single Level");

        var fields = new[] { "firstName", "department.name" };
        var selection = parser.Parse("Employee", fields);

        var query = executor.BuildQuery("Employee", selection);
        var results = query.Take(5).ToFlattened();

        Console.WriteLine($"Fields: [{string.Join(", ", fields)}]");
        Console.WriteLine($"Results: {results.Count} rows");

        if (results.Count > 0)
        {
            var sampleRow = results[0];
            Console.WriteLine($"Sample row keys: [{string.Join(", ", sampleRow.Keys)}]");
            Console.WriteLine($"Sample data: {JsonSerializer.Serialize(sampleRow, new JsonSerializerOptions { WriteIndented = false })}");

            // Verify expected keys
            AssertContainsKey(sampleRow, "firstName", "Test 2");
            AssertContainsKey(sampleRow, "department_name", "Test 2");
        }

        Console.WriteLine("✅ PASSED\n");
    }

    private static void TestNestedMultiLevel(IDynamicQueryExecutor executor, IFieldSpecificationParser parser)
    {
        PrintTestHeader("Test 3: Nested Multi Level");

        var fields = new[] { "firstName", "department.organisation.name" };
        var selection = parser.Parse("Employee", fields);

        var query = executor.BuildQuery("Employee", selection);
        var results = query.Take(5).ToFlattened();

        Console.WriteLine($"Fields: [{string.Join(", ", fields)}]");
        Console.WriteLine($"Results: {results.Count} rows");

        if (results.Count > 0)
        {
            var sampleRow = results[0];
            Console.WriteLine($"Sample row keys: [{string.Join(", ", sampleRow.Keys)}]");
            Console.WriteLine($"Sample data: {JsonSerializer.Serialize(sampleRow, new JsonSerializerOptions { WriteIndented = false })}");

            // Verify expected keys
            AssertContainsKey(sampleRow, "firstName", "Test 3");
            AssertContainsKey(sampleRow, "department_organisation_name", "Test 3");
        }

        Console.WriteLine("✅ PASSED\n");
    }

    private static void TestMultipleNavigations(IDynamicQueryExecutor executor, IFieldSpecificationParser parser)
    {
        PrintTestHeader("Test 4: Multiple Navigations");

        var fields = new[] { "firstName", "department.name", "role.title" };
        var selection = parser.Parse("Employee", fields);

        var query = executor.BuildQuery("Employee", selection);
        var results = query.Take(5).ToFlattened();

        Console.WriteLine($"Fields: [{string.Join(", ", fields)}]");
        Console.WriteLine($"Results: {results.Count} rows");

        if (results.Count > 0)
        {
            var sampleRow = results[0];
            Console.WriteLine($"Sample row keys: [{string.Join(", ", sampleRow.Keys)}]");
            Console.WriteLine($"Sample data: {JsonSerializer.Serialize(sampleRow, new JsonSerializerOptions { WriteIndented = false })}");

            // Verify expected keys
            AssertContainsKey(sampleRow, "firstName", "Test 4");
            AssertContainsKey(sampleRow, "department_name", "Test 4");
            AssertContainsKey(sampleRow, "role_title", "Test 4");
        }

        Console.WriteLine("✅ PASSED\n");
    }

    private static void TestWithWhereClause(IDynamicQueryExecutor executor, IFieldSpecificationParser parser)
    {
        PrintTestHeader("Test 5: With WHERE Clause");

        var fields = new[] { "firstName", "lastName", "department.name", "department.budget" };
        var selection = parser.Parse("Employee", fields);

        var result = executor.BuildAndExecute(
            "Employee",
            selection,
            whereClause: "Department.Budget >= 2000000");

        var results = result.Query.ToFlattened();

        Console.WriteLine($"Fields: [{string.Join(", ", fields)}]");
        Console.WriteLine($"WHERE: {result.GeneratedWhereClause}");
        Console.WriteLine($"Results: {results.Count} rows (filtered from database)");

        if (results.Count > 0)
        {
            var sampleRow = results[0];
            Console.WriteLine($"Sample data: {JsonSerializer.Serialize(sampleRow, new JsonSerializerOptions { WriteIndented = false })}");

            // Verify budget is >= 2000000
            if (sampleRow.TryGetValue("department_budget", out var budgetValue) && budgetValue != null)
            {
                var budget = Convert.ToDecimal(budgetValue);
                if (budget < 2000000)
                    throw new InvalidOperationException($"Budget filter failed: expected >= 2000000, got {budget}");
            }
        }

        Console.WriteLine("✅ PASSED\n");
    }

    private static void TestWithOrderBy(IDynamicQueryExecutor executor, IFieldSpecificationParser parser)
    {
        PrintTestHeader("Test 6: With ORDER BY");

        var fields = new[] { "firstName", "lastName" };
        var selection = parser.Parse("Employee", fields);

        var result = executor.BuildAndExecute(
            "Employee",
            selection,
            orderByClause: "LastName, FirstName");

        var results = result.Query.Take(5).ToFlattened();

        Console.WriteLine($"Fields: [{string.Join(", ", fields)}]");
        Console.WriteLine($"ORDER BY: {result.GeneratedOrderByClause}");
        Console.WriteLine($"Results: {results.Count} rows");

        if (results.Count > 1)
        {
            Console.WriteLine("First 3 rows (should be sorted by LastName, FirstName):");
            for (int i = 0; i < Math.Min(3, results.Count); i++)
            {
                var row = results[i];
                Console.WriteLine($"  {i + 1}. {row["lastName"]}, {row["firstName"]}");
            }
        }

        Console.WriteLine("✅ PASSED\n");
    }

    private static void TestWithTake(IDynamicQueryExecutor executor, IFieldSpecificationParser parser)
    {
        PrintTestHeader("Test 7: With TAKE Limit");

        var fields = new[] { "firstName", "lastName" };
        var selection = parser.Parse("Employee", fields);

        var result = executor.BuildAndExecute(
            "Employee",
            selection,
            take: 3);

        var results = result.Query.ToFlattened();

        Console.WriteLine($"Fields: [{string.Join(", ", fields)}]");
        Console.WriteLine($"TAKE: {result.TakeLimit}");
        Console.WriteLine($"Results: {results.Count} rows");

        if (results.Count != 3)
            throw new InvalidOperationException($"TAKE limit failed: expected 3 rows, got {results.Count}");

        Console.WriteLine("✅ PASSED\n");
    }

    private static void TestComplexQuery(IDynamicQueryExecutor executor, IFieldSpecificationParser parser)
    {
        PrintTestHeader("Test 8: Complex Query (All Features)");

        var fields = new[] { "firstName", "lastName", "department.name", "department.budget", "role.title" };
        var selection = parser.Parse("Employee", fields);

        var result = executor.BuildAndExecute(
            "Employee",
            selection,
            whereClause: "Department.Budget >= 2000000",
            orderByClause: "Department.Name, LastName",
            take: 5);

        var results = result.Query.ToFlattened();

        Console.WriteLine($"Fields: [{string.Join(", ", fields)}]");
        Console.WriteLine($"WHERE: {result.GeneratedWhereClause}");
        Console.WriteLine($"ORDER BY: {result.GeneratedOrderByClause}");
        Console.WriteLine($"TAKE: {result.TakeLimit}");
        Console.WriteLine($"Results: {results.Count} rows");

        if (results.Count > 0)
        {
            Console.WriteLine("\nAll rows:");
            foreach (var row in results)
            {
                Console.WriteLine($"  {row["firstName"]} {row["lastName"]} | Dept: {row["department_name"]} (${row["department_budget"]}) | Role: {row["role_title"]}");
            }
        }

        Console.WriteLine("✅ PASSED\n");
    }

    private static void PrintTestHeader(string testName)
    {
        Console.WriteLine(new string('-', 80));
        Console.WriteLine(testName);
        Console.WriteLine(new string('-', 80));
    }

    private static void AssertContainsKey(Dictionary<string, object?> dictionary, string key, string testName)
    {
        if (!dictionary.ContainsKey(key))
        {
            throw new InvalidOperationException(
                $"{testName} failed: Expected key '{key}' not found in result. Available keys: [{string.Join(", ", dictionary.Keys)}]");
        }
    }
}
