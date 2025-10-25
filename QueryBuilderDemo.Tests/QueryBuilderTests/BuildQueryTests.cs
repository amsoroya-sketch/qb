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
    public class BuildQueryTests
    {
        [TestMethod]
        public void BuildQuery_WithSingleLevelInclude_Departments_LoadsRelatedData()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            result.First().Departments.Should().NotBeEmpty();
            result.First().Departments.First().Id.Should().BeGreaterThan(0);
        }

        [TestMethod]
        public void BuildQuery_WithSingleLevelInclude_Projects_LoadsRelatedData()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Clients
                .BuildQuery(new HashSet<string> { "Projects" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var client = result.First();
            client.Projects.Should().NotBeEmpty();
            client.Projects.First().Id.Should().BeGreaterThan(0);
        }

        [TestMethod]
        public void BuildQuery_WithTwoLevelInclude_LoadsNestedRelationships()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments.Employees" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Departments.Should().NotBeEmpty();

            var dept = org.Departments.First();
            dept.Employees.Should().NotBeEmpty();
            dept.Employees.First().Id.Should().BeGreaterThan(0);
        }

        [TestMethod]
        public void BuildQuery_WithThreeLevelInclude_LoadsDeepHierarchy()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments.Employees.Skills" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Departments.Should().NotBeEmpty();

            var dept = org.Departments.First();
            dept.Employees.Should().NotBeEmpty();

            var emp = dept.Employees.First();
            emp.Skills.Should().NotBeNull(); // Collection initialized, may be empty
        }

        [TestMethod]
        public void BuildQuery_WithMultipleParallelIncludes_LoadsBothPaths()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Clients
                .BuildQuery(new HashSet<string> { "Projects", "Location", "Invoices" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var client = result.First();
            client.Projects.Should().NotBeEmpty();
            client.Location.Should().NotBeNull();
            client.Invoices.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildQuery_WithMultipleNestedIncludes_LoadsAllPaths()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Departments
                .BuildQuery(new HashSet<string>
                {
                    "Employees.Role",
                    "Employees.Projects",
                    "Organisation"
                })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var dept = result.First();
            dept.Organisation.Should().NotBeNull();
            dept.Employees.Should().NotBeEmpty();

            var emp = dept.Employees.First();
            emp.Role.Should().NotBeNull();
            emp.Projects.Should().NotBeNull();
        }

        [TestMethod]
        public void BuildQuery_WithComplexPath_ProjectsTasksAssignedTo()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Projects
                .BuildQuery(new HashSet<string> { "Tasks.AssignedTo.Department" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var project = result.First();
            project.Tasks.Should().NotBeEmpty();

            var assignedTask = project.Tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (assignedTask != null)
            {
                assignedTask.AssignedTo.Should().NotBeNull();
                assignedTask.AssignedTo!.Department.Should().NotBeNull();
            }
        }

        [TestMethod]
        public void BuildQuery_WithFourLevelDeepPath_LoadsCompletely()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments.Employees.Projects.Client" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Departments.Should().NotBeEmpty();

            var dept = org.Departments.First();
            dept.Employees.Should().NotBeEmpty();

            var emp = dept.Employees.FirstOrDefault(e => e.Projects.Any());
            if (emp != null)
            {
                emp.Projects.Should().NotBeEmpty();
                emp.Projects.First().Client.Should().NotBeNull();
            }
        }

        [TestMethod]
        public void BuildQuery_WithNullNavigationProperty_DoesNotCrash()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Tasks
                .BuildQuery(new HashSet<string> { "AssignedTo" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            // Some tasks have no assigned employee - should not crash
            var unassignedTask = result.FirstOrDefault(t => t.AssignedTo == null);
            unassignedTask.Should().NotBeNull(); // At least one unassigned task exists
        }

        [TestMethod]
        public void BuildQuery_WithManyToManyRelationship_EmployeeProjects_Loads()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Employees
                .BuildQuery(new HashSet<string> { "Projects" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var empWithProjects = result.FirstOrDefault(e => e.Projects.Any());
            empWithProjects.Should().NotBeNull();
            empWithProjects!.Projects.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildQuery_WithManyToManyRelationship_EmployeeSkills_Loads()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Employees
                .BuildQuery(new HashSet<string> { "Skills" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var empWithSkills = result.FirstOrDefault(e => e.Skills.Any());
            empWithSkills.Should().NotBeNull();
            empWithSkills!.Skills.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildQuery_WithManyToManyRelationship_TeamMembers_Loads()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Teams
                .BuildQuery(new HashSet<string> { "Members" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var team = result.First();
            team.Members.Should().NotBeEmpty();
            team.Members.First().Id.Should().BeGreaterThan(0);
        }

        [TestMethod]
        public void BuildQuery_WithInvalidPropertyName_SkipsInvalidPath()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Organisations
                .BuildQuery(new HashSet<string> { "InvalidProperty" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty(); // Should still return data
        }

        [TestMethod]
        public void BuildQuery_WithNestedManyToMany_ProjectTeamMembersSkills()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Projects
                .BuildQuery(new HashSet<string> { "TeamMembers.Skills" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var project = result.First();
            project.TeamMembers.Should().NotBeEmpty();

            var member = project.TeamMembers.FirstOrDefault(m => m.Skills.Any());
            if (member != null)
            {
                member.Skills.Should().NotBeEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_WithReverseNavigation_ClientLocationClients()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var result = context.Locations
                .BuildQuery(new HashSet<string> { "Clients" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var location = result.FirstOrDefault(l => l.Clients.Any());
            location.Should().NotBeNull();
            location!.Clients.Should().NotBeEmpty();
        }
    }
}
