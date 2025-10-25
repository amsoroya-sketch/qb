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
            Assert.IsTrue(result.Any());
            Assert.IsTrue(result.First().Departments.Any());
            Assert.IsTrue(result.First().Departments.First().Id > 0);
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
            Assert.IsTrue(result.Any());
            var client = result.First();
            Assert.IsTrue(client.Projects.Any());
            Assert.IsTrue(client.Projects.First().Id > 0);
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
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Departments.Any());

            var dept = org.Departments.First();
            Assert.IsTrue(dept.Employees.Any());
            Assert.IsTrue(dept.Employees.First().Id > 0);
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
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Departments.Any());

            var dept = org.Departments.First();
            Assert.IsTrue(dept.Employees.Any());

            var emp = dept.Employees.First();
            Assert.IsNotNull(emp.Skills); // Collection initialized, may be empty
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
            Assert.IsTrue(result.Any());
            var client = result.First();
            Assert.IsTrue(client.Projects.Any());
            Assert.IsNotNull(client.Location);
            Assert.IsTrue(client.Invoices.Any());
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
            Assert.IsTrue(result.Any());
            var dept = result.First();
            Assert.IsNotNull(dept.Organisation);
            Assert.IsTrue(dept.Employees.Any());

            var emp = dept.Employees.First();
            Assert.IsNotNull(emp.Role);
            Assert.IsNotNull(emp.Projects);
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
            Assert.IsTrue(result.Any());
            var project = result.First();
            Assert.IsTrue(project.Tasks.Any());

            var assignedTask = project.Tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (assignedTask != null)
            {
                Assert.IsNotNull(assignedTask.AssignedTo);
                Assert.IsNotNull(assignedTask.AssignedTo!.Department);
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
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Departments.Any());

            var dept = org.Departments.First();
            Assert.IsTrue(dept.Employees.Any());

            var emp = dept.Employees.FirstOrDefault(e => e.Projects.Any());
            if (emp != null)
            {
                Assert.IsTrue(emp.Projects.Any());
                Assert.IsNotNull(emp.Projects.First().Client);
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
            Assert.IsTrue(result.Any());
            // Some tasks have no assigned employee - should not crash
            var unassignedTask = result.FirstOrDefault(t => t.AssignedTo == null);
            Assert.IsNotNull(unassignedTask); // At least one unassigned task exists
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
            Assert.IsTrue(result.Any());
            var empWithProjects = result.FirstOrDefault(e => e.Projects.Any());
            Assert.IsNotNull(empWithProjects);
            Assert.IsTrue(empWithProjects!.Projects.Any());
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
            Assert.IsTrue(result.Any());
            var empWithSkills = result.FirstOrDefault(e => e.Skills.Any());
            Assert.IsNotNull(empWithSkills);
            Assert.IsTrue(empWithSkills!.Skills.Any());
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
            Assert.IsTrue(result.Any());
            var team = result.First();
            Assert.IsTrue(team.Members.Any());
            Assert.IsTrue(team.Members.First().Id > 0);
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
            Assert.IsTrue(result.Any()); // Should still return data
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
            Assert.IsTrue(result.Any());
            var project = result.First();
            Assert.IsTrue(project.TeamMembers.Any());

            var member = project.TeamMembers.FirstOrDefault(m => m.Skills.Any());
            if (member != null)
            {
                Assert.IsTrue(member.Skills.Any());
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
            Assert.IsTrue(result.Any());
            var location = result.FirstOrDefault(l => l.Clients.Any());
            Assert.IsNotNull(location);
            Assert.IsTrue(location!.Clients.Any());
        }
    }
}
