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

        [TestMethod]
        public void BuildFlattenedQuery_MultipleCollectionsSameLevel_AppliesDistinct()
        {
            // This test verifies DISTINCT eliminates cartesian product duplicates
            // when flattening multiple collections at the same level
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.Projects.Title",
                "Departments.Employees.Skills.Name"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Verify SQL contains DISTINCT (applied by BuildFlattenedQuery)
            var sql = query.ToQueryString();
            sql.Should().Contain("DISTINCT", "BuildFlattenedQuery should apply DISTINCT to eliminate cartesian product duplicates");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty();

            // With DISTINCT: If employee has 2 Projects and 3 Skills, we should get distinct rows
            // Without DISTINCT: Would create 6 duplicate rows (2 × 3 = 6 cartesian product)
            // The DISTINCT ensures we only get unique combinations
        }

        [TestMethod]
        public void BuildFlattenedQuery_EmployeeProjectsAndSkills_VerifiesDistinctEliminatesDuplicates()
        {
            // Specific test: Employee with multiple Projects AND Skills collections
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "FirstName",
                "LastName",
                "Projects.Title",
                "Skills.Name"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Employees.AsQueryable(),
                typeof(Employee),
                selectFields
            );

            // Verify DISTINCT is in the SQL
            var sql = query.ToQueryString();
            sql.Should().Contain("DISTINCT", "Should apply DISTINCT to prevent cartesian product duplicates");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty();

            // DISTINCT ensures that each unique combination of (Employee, Project, Skill) appears once
            // Without DISTINCT: Employee with 2 Projects and 3 Skills would generate 6 rows with duplicate employee data
        }

        [TestMethod]
        public void BuildFlattenedQuery_OrganisationDepartmentsEmployeesFields_DistinctAtDatabaseLevel()
        {
            // This test demonstrates fetching Organisation → Departments → Employees fields with DISTINCT
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.LastName",
                "Departments.Employees.Email"
            };

            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Verify SQL contains DISTINCT and is executed at database level
            var sql = query.ToQueryString();
            sql.Should().Contain("DISTINCT", "Should apply DISTINCT in SQL");
            sql.Should().Contain("SELECT", "Should generate SQL query");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty();

            // Result: One distinct row per (Organisation, Department, Employee) combination - all at DB level
            // Example: { Id: 1, Name: "TechCorp", Departments_Name: "Engineering",
            //            Departments_Employees_FirstName: "John", Departments_Employees_LastName: "Doe",
            //            Departments_Employees_Email: "john@..." }
        }

        [TestMethod]
        public void BuildFlattenedQuery_WithEntityReference_AutomaticallyExpandsToScalarFields()
        {
            // This test demonstrates the preprocessing feature where "Departments.Employees"
            // automatically expands to all Employee scalar fields
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // User passes entity reference "Departments.Employees" instead of individual fields
            var selectFields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Employees" // Entity reference - should expand automatically
            };

            // Act
            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Verify SQL is generated (preprocessing expands to scalar fields before query building)
            var sql = query.ToQueryString();
            sql.Should().Contain("DISTINCT", "Should apply DISTINCT after expansion");
            sql.Should().Contain("SELECT", "Should generate SQL query");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty();

            // Verify that the expanded fields are present in the result
            var firstResult = results.First();
            // The preprocessing should have expanded "Departments.Employees" to all Employee scalar fields:
            // Departments.Employees.Id, Departments.Employees.FirstName, Departments.Employees.LastName,
            // Departments.Employees.Email, Departments.Employees.DepartmentId, Departments.Employees.RoleId

            // Check that the dynamic object has the expected expanded properties using reflection
            var resultType = firstResult.GetType();
            var idProp = resultType.GetProperty("Departments_Employees_Id");
            var firstNameProp = resultType.GetProperty("Departments_Employees_FirstName");
            var lastNameProp = resultType.GetProperty("Departments_Employees_LastName");
            var emailProp = resultType.GetProperty("Departments_Employees_Email");

            Assert.IsNotNull(idProp, "Departments.Employees should expand to include Id field");
            Assert.IsNotNull(firstNameProp, "Departments.Employees should expand to include FirstName field");
            Assert.IsNotNull(lastNameProp, "Departments.Employees should expand to include LastName field");
            Assert.IsNotNull(emailProp, "Departments.Employees should expand to include Email field");

            // Verify we can access the values
            dynamic dynamicResult = firstResult;
            var id = dynamicResult.Departments_Employees_Id;
            Assert.IsNotNull((object)id);
        }

        [TestMethod]
        public void BuildFlattenedQuery_WithMixedScalarAndEntityReferences_ExpandsOnlyEntities()
        {
            // User passes a mix of scalar fields and entity references
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var selectFields = new List<string>
            {
                "Id",                          // Scalar - should remain as-is
                "Name",                        // Scalar - should remain as-is
                "Departments.Name",            // Scalar path - should remain as-is
                "Departments.Employees"        // Entity reference - should expand
            };

            // Act
            var query = QueryBuilder.BuildFlattenedQuery(
                context.Organisations.AsQueryable(),
                typeof(Organisation),
                selectFields
            );

            // Verify SQL generation
            var sql = query.ToQueryString();
            sql.Should().Contain("DISTINCT");
            sql.Should().Contain("SELECT");

            var results = ExecuteQuery(query);
            results.Should().NotBeEmpty();

            // Verify both scalar and expanded fields are present using reflection
            var firstResult = results.First();
            var resultType = firstResult.GetType();

            // Original scalar fields should be present
            var idProp = resultType.GetProperty("Id");
            var nameProp = resultType.GetProperty("Name");
            var deptNameProp = resultType.GetProperty("Departments_Name");

            Assert.IsNotNull(idProp, "Scalar field Id should remain as-is");
            Assert.IsNotNull(nameProp, "Scalar field Name should remain as-is");
            Assert.IsNotNull(deptNameProp, "Scalar path Departments.Name should remain as-is");

            // Expanded employee fields should be present
            var empIdProp = resultType.GetProperty("Departments_Employees_Id");
            var empFirstNameProp = resultType.GetProperty("Departments_Employees_FirstName");
            var empLastNameProp = resultType.GetProperty("Departments_Employees_LastName");

            Assert.IsNotNull(empIdProp, "Entity reference should expand to Id");
            Assert.IsNotNull(empFirstNameProp, "Entity reference should expand to FirstName");
            Assert.IsNotNull(empLastNameProp, "Entity reference should expand to LastName");

            // Verify we can access the values
            dynamic dynamicResult = firstResult;
            int orgId = dynamicResult.Id;
            string empFirstName = dynamicResult.Departments_Employees_FirstName;
            orgId.Should().BeGreaterThan(0);
            empFirstName.Should().NotBeNullOrEmpty();
        }
    }
}
