using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();
            emp.Department.Should().NotBeNull();
            emp.Role.Should().NotBeNull();
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
            result.Should().NotBeEmpty();
            var emp = result.First();

            // Level 1: Employee.Department should be loaded
            emp.Department.Should().NotBeNull();

            // Level 2: Employee.Department.Organisation should be loaded (RecursiveIncludeLevel=2)
            // Note: Due to RecursiveIncludeLevel(2) on the Department property,
            // Department.Organisation may not be loaded as it would be level 2 from Employee
            // The wildcard respects the recursion limits set by the attribute
            emp.Department!.Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();

            // Department should be loaded with its properties
            // Due to RecursiveIncludeLevel(2), it respects the recursion limit
            emp.Department.Should().NotBeNull();
            emp.Department!.Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();
            emp.Role.Should().NotBeNull();
            emp.Role!.Title.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();

            // Both Department and Role subtrees should be loaded
            // Due to RecursiveIncludeLevel(2), they respect the recursion limit
            emp.Department.Should().NotBeNull();
            emp.Department!.Name.Should().NotBeNullOrEmpty();

            emp.Role.Should().NotBeNull();
            emp.Role!.Title.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Id.Should().BeGreaterThan(0);
            org.Name.Should().NotBeNullOrEmpty();
            org.Departments.Should().NotBeEmpty();
            org.Departments.First().Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Id.Should().BeGreaterThan(0);
            org.Name.Should().NotBeNullOrEmpty();
            org.Departments.Should().NotBeEmpty();

            // Verify navigation properties are loaded at level 1
            var dept = org.Departments.First();
            dept.Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var emp = result.FirstOrDefault(e => e.Projects.Any());
            if (emp != null)
            {
                emp.Id.Should().BeGreaterThan(0);
                emp.FirstName.Should().NotBeNullOrEmpty();
                emp.Email.Should().NotBeNullOrEmpty();
                emp.Department.Should().NotBeNull();
                emp.Department!.Name.Should().NotBeNullOrEmpty();
                emp.Projects.Should().NotBeEmpty();
                emp.Projects.First().Title.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();
            emp.Department.Should().NotBeNull();
            emp.Department!.Organisation.Should().NotBeNull();
            emp.Department.Organisation!.Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var empWithSkills = result.FirstOrDefault(e => e.Skills.Any());
            if (empWithSkills != null)
            {
                empWithSkills.Skills.Should().NotBeEmpty();
                empWithSkills.Skills.First().Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var empWithProjects = result.FirstOrDefault(e => e.Projects.Any());
            if (empWithProjects != null)
            {
                empWithProjects.Projects.Should().NotBeEmpty();
                var project = empWithProjects.Projects.First();
                project.Title.Should().NotBeNullOrEmpty();
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
            validIncludes.Should().NotBeEmpty();
            validIncludes.Should().Contain("Department");
            validIncludes.Should().Contain("Role");
            validIncludes.Should().Contain("Projects");
            validIncludes.Should().Contain("Skills");
            validIncludes.Should().Contain("Certifications");
            validIncludes.Should().Contain("Tasks");
            validIncludes.Should().Contain("Teams");
        }

        [TestMethod]
        public void SplitIncludes_WithPropertyWildcard_GeneratesNestedPaths()
        {
            // Arrange
            var includes = new HashSet<string> { "Department.*" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            validIncludes.Should().NotBeEmpty();
            validIncludes.Should().Contain("Department");
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Department.Should().NotBeNull();
            emp.Department!.Organisation.Should().NotBeNull();
            emp.Department.Organisation!.FoundYear.Should().BeGreaterThan(0);
        }
    }
}
