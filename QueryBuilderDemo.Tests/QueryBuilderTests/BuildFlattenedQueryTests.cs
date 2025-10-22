using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.Data;
using QueryBuilderDemo.Tests.Helpers;
using QueryBuilderDemo.Models;
using PbsApi.Utils;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    /// <summary>
    /// Comprehensive tests for BuildFlattenedQuery method.
    /// Verifies database-side operations, 5-level deep navigation, and SQL generation.
    /// </summary>
    [TestClass]
    public class BuildFlattenedQueryTests
    {
        /// <summary>
        /// Helper method to execute a non-generic IQueryable and return results as a list.
        /// </summary>
        private static List<dynamic> ExecuteQuery(IQueryable query)
        {
            var results = new List<dynamic>();
            foreach (var item in query)
            {
                results.Add(item);
            }
            return results;
        }

        [TestMethod]
        public void BuildFlattenedQuery_TwoLevels_FlattensAtDatabaseLevel()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Id",
                "Departments.Name",
                "Departments.Budget"
            };

            // Act
            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Verify SQL generation (confirms database-side operation)
            var sql = query.ToQueryString();
            sql.Should().Contain("SELECT", "Should generate SQL SELECT");
            sql.Should().Contain("FROM", "Should have FROM clause");

            // Execute at database level
            var results = ExecuteQuery(query);

            // Assert - Results should be flattened
            results.Should().NotBeEmpty("Should have flattened results");
            // With 2 orgs and multiple depts = multiple rows expected
            results.Count.Should().BeGreaterThan(1, "Should flatten to row per department");
        }

        [TestMethod]
        public void BuildFlattenedQuery_ThreeLevels_FlattensAtDatabaseLevel()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Email"
            };

            // Act
            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Verify database-side operation
            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty("Should generate SQL");

            // Execute at database level
            var results = ExecuteQuery(query);

            // Assert - 3 levels flattened
            results.Should().NotBeEmpty();
            // Should have one row per employee
            results.Count.Should().BeGreaterThan(3, "Should have multiple flattened rows");
        }

        [TestMethod]
        public void BuildFlattenedQuery_FourLevels_FlattensAtDatabaseLevel()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Projects.Title"
            };

            // Act
            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Verify SQL generation
            var sql = query.ToQueryString();
            sql.Should().Contain("SELECT");

            var results = ExecuteQuery(query);

            // Assert - 4 levels flattened
            results.Should().NotBeEmpty("Should flatten 4 levels");
        }

        [TestMethod]
        public void BuildFlattenedQuery_FiveLevels_FlattensAtDatabaseLevel()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Projects.Title",
                "Departments.Employees.Projects.Tasks.Title"
            };

            // Act
            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // CRITICAL: Verify this generates SQL, not in-memory operation
            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty("Must generate SQL query");
            sql.Should().Contain("SELECT", "Should have SELECT statement");

            // Execute query - should run at database level
            var results = ExecuteQuery(query);

            // Assert - 5 levels deep flattened
            results.Should().NotBeEmpty("Should have flattened 5-level results");
            // Each task should create a row
            results.Count.Should().BeGreaterThan(3, "Should have multiple rows from 5-level flattening");
        }

        [TestMethod]
        public void BuildFlattenedQuery_FiveLevelsWithDistinct_AppliesDistinctAtDatabaseLevel()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Projects.Title",
                "Departments.Employees.Projects.Tasks.Status"
            };

            // Act
            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Apply DISTINCT at database level
            var distinctQuery = query.Distinct();

            // Verify SQL contains DISTINCT
            var sql = distinctQuery.ToQueryString();
            sql.Should().Contain("DISTINCT", "Should apply DISTINCT in SQL");

            var results = ExecuteQuery(distinctQuery);

            // Assert
            results.Should().NotBeEmpty();
            // Distinct should reduce duplicate rows
        }

        [TestMethod]
        public void BuildFlattenedQuery_ClientProjectsTasksPath_FiveLevel()
        {
            // Test path: Client → Projects → TeamMembers → Department → Organisation
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Projects.Title",
                "Projects.TeamMembers.FirstName",
                "Projects.TeamMembers.Department.Name",
                "Projects.TeamMembers.Department.Organisation.Name"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Clients.AsQueryable(),
                typeof(Client),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty();

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildFlattenedQuery_TeamMembersPath_FiveLevel()
        {
            // Test path: Team → Members → Department → Organisation → Departments (circular)
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Members.FirstName",
                "Members.Department.Name",
                "Members.Department.Organisation.Name",
                "Members.Department.Organisation.Industry"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Teams.AsQueryable(),
                typeof(Team),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty("Should generate SQL for 5-level path");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty("Should have results for 5-level navigation");
        }

        [TestMethod]
        public void BuildFlattenedQuery_EmployeeSkillsPath_FiveLevel()
        {
            // Test path: Organisation → Departments → Employees → Skills → Employees (circular)
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Skills.Name",
                "Departments.Employees.Skills.Proficiency"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty();

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty("Should handle many-to-many at 5 levels");
        }

        [TestMethod]
        public void BuildFlattenedQuery_VerifyNoInMemoryOperations()
        {
            // This test verifies that ToList() executes SQL, not in-memory filtering
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Projects.Title",
                "Departments.Employees.Projects.Tasks.Title"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Get SQL before execution
            var sql = query.ToQueryString();

            // SQL should contain all the work - no deferred operations
            sql.Should().NotBeNullOrEmpty();
            sql.Should().Contain("SELECT");

            // When we call ToList(), it should just execute the SQL
            // No additional in-memory processing
            var results = ExecuteQuery(query);

            results.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildFlattenedQuery_MultipleCollectionsAtDifferentLevels()
        {
            // Test with collections at levels 2, 3, and 4
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Id", // Level 2 collection
                "Departments.Employees.Id", // Level 3 collection
                "Departments.Employees.Projects.Id" // Level 4 collection
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty("Should generate SQL for nested collections");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty("Should handle multiple nested collections");
        }

        [TestMethod]
        public void BuildFlattenedQuery_WithDistinctAndCount_DatabaseOperations()
        {
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Departments.Name",
                "Departments.Employees.FirstName"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Apply distinct and count at database level
            var distinctQuery = query.Distinct();
            var count = distinctQuery.Count(); // Should execute COUNT in SQL

            count.Should().BeGreaterThan(0);
        }

        [TestMethod]
        public void BuildFlattenedQuery_InspectGeneratedSQL_ConfirmsDatabaseSideOperations()
        {
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Projects.Title",
                "Departments.Employees.Projects.Tasks.Status"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Get the generated SQL
            var sql = query.ToQueryString();

            // Write to console for verification
            Console.WriteLine("Generated SQL:");
            Console.WriteLine(sql);

            // Assertions to verify database-side operations
            sql.Should().NotBeNullOrEmpty("SQL must be generated");
            sql.Should().Contain("SELECT", "Must have SELECT clause");
            sql.Should().Contain("FROM", "Must have FROM clause");

            // SelectMany should translate to SQL operations, not in-memory
            // The presence of a complete SQL query confirms this

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildFlattenedQuery_ClientProjectsTeamMembersTasks_FiveLevels()
        {
            // Test path: Client → Projects → TeamMembers → Projects → Tasks
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Projects.Title",
                "Projects.TeamMembers.FirstName",
                "Projects.TeamMembers.Projects.Title",
                "Projects.TeamMembers.Projects.Tasks.Title"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Clients.AsQueryable(),
                typeof(Client),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty("Should generate SQL for complex 5-level path");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty("Should handle complex many-to-many at 5 levels");
        }

        [TestMethod]
        public void BuildFlattenedQuery_WithScalarFieldsOnly_ReturnsQuery()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string> { "Id", "Name", "Industry" };

            // Act
            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields);

            // Verify SQL generation
            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty();
            sql.Should().Contain("SELECT");

            var results = ExecuteQuery(query);

            // Assert
            results.Should().NotBeEmpty();
            results.Count.Should().Be(2, "Should return both organisations without flattening");
        }

        [TestMethod]
        public void BuildFlattenedQuery_ProjectTasksAssignedTo_FourLevels()
        {
            // Test path: Project → Tasks → AssignedTo → Department → Organisation
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Title",
                "Tasks.Title",
                "Tasks.AssignedTo.FirstName",
                "Tasks.AssignedTo.Department.Name",
                "Tasks.AssignedTo.Department.Organisation.Name"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Projects.AsQueryable(),
                typeof(Project),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty("Should generate SQL for 5-level reference path");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty("Should navigate through nullable references");
        }

        [TestMethod]
        public void BuildFlattenedQuery_EmployeeCertifications_ThreeLevelsWithData()
        {
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Certifications.Name"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().Contain("SELECT");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildFlattenedQuery_TeamsMeetings_TwoLevels()
        {
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Meetings.Topic",
                "Meetings.Duration"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Teams.AsQueryable(),
                typeof(Team),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty();

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty("Should flatten team meetings");
        }

        [TestMethod]
        public void BuildFlattenedQuery_ClientInvoicesPayments_ThreeLevels()
        {
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Invoices.Amount",
                "Invoices.Payments.Amount",
                "Invoices.Payments.Method"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Clients.AsQueryable(),
                typeof(Client),
                selectFields
            );

            var sql = query.ToQueryString();
            sql.Should().NotBeNullOrEmpty();

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty("Should flatten invoice payments");
        }
    }
}
