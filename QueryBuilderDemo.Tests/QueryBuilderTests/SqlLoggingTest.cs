using Microsoft.VisualStudio.TestTools.UnitTesting;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Models;
using QueryBuilderDemo.Tests.Helpers;
using PbsApi.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Linq;
using System.Collections.Generic;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    [TestClass]
    public class SqlLoggingTest
    {
        [TestMethod]
        public void TestSQLGeneration_WithOrdering()
        {
            // Arrange - Create context with SQL logging
            var sqlQueries = new List<string>();

            var connection = new Microsoft.Data.Sqlite.SqliteConnection("DataSource=:memory:");
            connection.Open();

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(connection)
                .LogTo(message =>
                {
                    if (message.Contains("SELECT"))
                    {
                        sqlQueries.Add(message);
                        Console.WriteLine($"\n{message}");
                    }
                }, new[] { DbLoggerCategory.Database.Command.Name })
                .EnableSensitiveDataLogging()
                .Options;

            using var context = new ApplicationDbContext(options);
            context.Database.EnsureCreated();
            SampleDataSeeder.SeedTestData(context);

            Console.WriteLine("\n========== QUERY EXPRESSION ==========");

            // Act - Build query with ordering
            var query = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments" });

            Console.WriteLine($"Expression: {query.Expression}");

            Console.WriteLine("\n========== EXECUTING QUERY - SQL OUTPUT ==========");

            var result = query.ToList();

            Console.WriteLine($"\n========== RESULTS ==========");
            Console.WriteLine($"Total organisations: {result.Count}");
            if (result.Any())
            {
                var org = result.First();
                Console.WriteLine($"First organisation: {org.Name}");
                Console.WriteLine($"Department count: {org.Departments.Count}");
                Console.WriteLine($"Department names (in order): {string.Join(", ", org.Departments.Select(d => d.Name))}");
                Console.WriteLine($"Department IDs (in order): {string.Join(", ", org.Departments.Select(d => d.Id))}");

                // Show expected alphabetical order
                var expected = org.Departments.OrderBy(d => d.Name).Select(d => d.Name).ToList();
                Console.WriteLine($"Expected alphabetical: {string.Join(", ", expected)}");
                Console.WriteLine($"Matches expected? {string.Join(", ", org.Departments.Select(d => d.Name)).Equals(string.Join(", ", expected))}");
            }

            Console.WriteLine($"\n========== TOTAL SQL QUERIES EXECUTED: {sqlQueries.Count} ==========");

            connection.Dispose();
        }
    }
}
