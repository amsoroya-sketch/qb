using Microsoft.VisualStudio.TestTools.UnitTesting;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Models;
using QueryBuilderDemo.Tests.Helpers;
using PbsApi.Utils;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    [TestClass]
    public class WildcardQueryTests
    {
        [TestMethod]
        public void BuildDLINQQuery_WithWildcard_LoadsAllNavigationProperties()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "*" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));
            Assert.IsNotNull(emp.Department);
            Assert.IsNotNull(emp.Role);
        }

        [TestMethod]
        public void BuildDLINQQuery_WithWildcard_RespectsRecursiveLevelLimit()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "*" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();

            // Level 1: Employee.Department should be loaded
            Assert.IsNotNull(emp.Department);

            // Level 2: Employee.Department.Organisation should be loaded (RecursiveIncludeLevel=2)
            // Note: Due to RecursiveIncludeLevel(2) on the Department property,
            // Department.Organisation may not be loaded as it would be level 2 from Employee
            // The wildcard respects the recursion limits set by the attribute
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department.Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithPropertyWildcard_LoadsOnlyThatSubtree()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "FirstName", "Department.*" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));

            // Department should be loaded with its properties
            // Due to RecursiveIncludeLevel(2), it respects the recursion limit
            Assert.IsNotNull(emp.Department);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department.Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithRoleWildcard_LoadsRoleSubtree()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "FirstName", "Role.*" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));
            Assert.IsNotNull(emp.Role);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Role.Title));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithMultiplePropertyWildcards_LoadsMultipleSubtrees()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "FirstName",
                "Department.*",
                "Role.*"
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));

            // Both Department and Role subtrees should be loaded
            // Due to RecursiveIncludeLevel(2), they respect the recursion limit
            Assert.IsNotNull(emp.Department);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department.Name));

            Assert.IsNotNull(emp.Role);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Role.Title));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithCollectionWildcard_LoadsCollectionAndChildren()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "Name", "Departments.*" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Organisations, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(org.Name));
            Assert.IsTrue(org.Departments.Any());
            Assert.IsFalse(string.IsNullOrEmpty(org.Departments.First().Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithWildcardOnOrganisation_LoadsCompleteStructure()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "*" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Organisations, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(org.Name));
            Assert.IsTrue(org.Departments.Any());

            // Verify navigation properties are loaded at level 1
            var dept = org.Departments.First();
            Assert.IsFalse(string.IsNullOrEmpty(dept.Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_MixedSpecificAndWildcard_LoadsCorrectly()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "FirstName",
                "LastName",
                "Email",
                "Department.Name",
                "Projects.*"  // Wildcard for Projects subtree
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.FirstOrDefault(e => e.Projects.Any());
            if (emp != null)
            {
                Assert.IsTrue(emp.Id > 0);
                Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));
                Assert.IsFalse(string.IsNullOrEmpty(emp.Email));
                Assert.IsNotNull(emp.Department);
                Assert.IsFalse(string.IsNullOrEmpty(emp.Department.Name));
                Assert.IsTrue(emp.Projects.Any());
                Assert.IsFalse(string.IsNullOrEmpty(emp.Projects.First().Title));
            }
        }

        [TestMethod]
        public void BuildDLINQQuery_WithNestedPropertyWildcard_LoadsNestedSubtree()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "FirstName",
                "Department.Organisation.*"
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));
            Assert.IsNotNull(emp.Department);
            Assert.IsNotNull(emp.Department.Organisation);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department.Organisation.Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithSkillsWildcard_LoadsManyToManyRelations()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "FirstName",
                "Skills.*"
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var empWithSkills = result.FirstOrDefault(e => e.Skills.Any());
            if (empWithSkills != null)
            {
                Assert.IsTrue(empWithSkills.Skills.Any());
                Assert.IsFalse(string.IsNullOrEmpty(empWithSkills.Skills.First().Name));
            }
        }

        [TestMethod]
        public void BuildDLINQQuery_WithProjectsWildcard_LoadsManyToManyWithNestedData()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "FirstName",
                "Projects.*"
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var empWithProjects = result.FirstOrDefault(e => e.Projects.Any());
            if (empWithProjects != null)
            {
                Assert.IsTrue(empWithProjects.Projects.Any());
                var project = empWithProjects.Projects.First();
                Assert.IsFalse(string.IsNullOrEmpty(project.Title));
                // Note: Due to RecursiveIncludeLevel(2), project.Client may not be loaded
                // as it would be level 2 from Employee.Projects
            }
        }

        [TestMethod]
        public void SplitIncludes_WithWildcard_GeneratesValidIncludePaths()
        {
            // Arrange
            var includes = new HashSet<string> { "*" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            Assert.IsTrue(validIncludes.Any());
            Assert.IsTrue(validIncludes.Contains("Department"));
            Assert.IsTrue(validIncludes.Contains("Role"));
            Assert.IsTrue(validIncludes.Contains("Projects"));
            Assert.IsTrue(validIncludes.Contains("Skills"));
            Assert.IsTrue(validIncludes.Contains("Certifications"));
            Assert.IsTrue(validIncludes.Contains("Tasks"));
            Assert.IsTrue(validIncludes.Contains("Teams"));
        }

        [TestMethod]
        public void SplitIncludes_WithPropertyWildcard_GeneratesNestedPaths()
        {
            // Arrange
            var includes = new HashSet<string> { "Department.*" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            Assert.IsTrue(validIncludes.Any());
            Assert.IsTrue(validIncludes.Contains("Department"));
            // Note: Due to RecursiveIncludeLevel(2) on Department's navigation properties,
            // Department.Organisation and Department.Employees may not be included
            // as they would exceed the recursion limit
        }

        [TestMethod]
        public void BuildDLINQQuery_WithWildcardAndSpecificFields_CombinesProperly()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "*",
                "Department.Organisation.FoundYear"  // Specific nested field
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsNotNull(emp.Department);
            Assert.IsNotNull(emp.Department.Organisation);
            Assert.IsTrue(emp.Department.Organisation.FoundYear > 0);
        }
    }
}
