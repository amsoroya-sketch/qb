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
    public class BasicQueryBuilderTests
    {
        [TestMethod]
        public void BuildQuery_WithSingleLevelInclude_LoadsRelatedData()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateSeededContext();
            var includes = new HashSet<string> { "Departments" };

            // Act
            var result = context.Organisations
                .BuildQuery(includes)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            Assert.IsTrue(result.Count() > 0);
            Assert.IsTrue(result.First().Departments.Any());
        }

        [TestMethod]
        public void BuildQuery_WithNestedIncludes_LoadsNestedRelatedData()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateSeededContext();
            var includes = new HashSet<string> { "Departments.Employees" };

            // Act
            var result = context.Organisations
                .BuildQuery(includes)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            Assert.IsTrue(result.First().Departments.Any());
            Assert.IsTrue(result.First().Departments.First().Employees.Any());
        }

        [TestMethod]
        public void BuildQuery_WithMultipleNestedIncludes_LoadsAllData()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateSeededContext();
            var includes = new HashSet<string>
            {
                "Departments.Employees.Role",
                "Departments.Employees.Skills"
            };

            // Act
            var result = context.Organisations
                .BuildQuery(includes)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var firstOrg = result.First();
            Assert.IsTrue(firstOrg.Departments.Any());

            var firstDept = firstOrg.Departments.First();
            Assert.IsTrue(firstDept.Employees.Any());

            var firstEmployee = firstDept.Employees.First();
            Assert.IsNotNull(firstEmployee.Role);
        }

        [TestMethod]
        public void Context_CanQueryEmployees_WithComplexRelationships()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateSeededContext();
            var includes = new HashSet<string>
            {
                "Department.Organisation",
                "Role",
                "Projects",
                "Skills"
            };

            // Act
            var result = context.Employees
                .BuildQuery(includes)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var employee = result.First();
            Assert.IsNotNull(employee.Department);
            Assert.IsNotNull(employee.Department!.Organisation);
            Assert.IsNotNull(employee.Role);
        }

        [TestMethod]
        public void Context_CanQueryProjects_WithTasksAndTeamMembers()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateSeededContext();
            var includes = new HashSet<string>
            {
                "Tasks.AssignedTo",
                "TeamMembers.Department",
                "Client.Location"
            };

            // Act
            var result = context.Projects
                .BuildQuery(includes)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var project = result.First();
            Assert.IsTrue(project.Tasks.Any());
            Assert.IsTrue(project.TeamMembers.Any());
            Assert.IsNotNull(project.Client);
            Assert.IsNotNull(project.Client!.Location);
        }

        [TestMethod]
        public void Context_CanQueryClients_WithInvoicesAndPayments()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateSeededContext();
            var includes = new HashSet<string>
            {
                "Location",
                "Projects",
                "Invoices.Payments"
            };

            // Act
            var result = context.Clients
                .BuildQuery(includes)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var client = result.First();
            Assert.IsNotNull(client.Location);
            Assert.IsTrue(client.Projects.Any());
            Assert.IsTrue(client.Invoices.Any());
            Assert.IsTrue(client.Invoices.First().Payments.Any());
        }

        [TestMethod]
        public void Context_CanQueryTeams_WithMembersAndMeetings()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateSeededContext();
            var includes = new HashSet<string>
            {
                "Members.Department",
                "Meetings"
            };

            // Act
            var result = context.Teams
                .BuildQuery(includes)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var team = result.First();
            Assert.IsTrue(team.Members.Any());
            Assert.IsTrue(team.Meetings.Any());
        }

        [TestMethod]
        public void SampleData_HasCorrectCounts()
        {
            // Arrange & Act
            using var context = TestDbContextFactory.CreateSeededContext();

            // Assert - verify all data was seeded
            Assert.AreEqual(2, context.Organisations.Count());
            Assert.AreEqual(6, context.Departments.Count());
            Assert.AreEqual(6, context.Employees.Count());
            Assert.AreEqual(3, context.Locations.Count());
            Assert.AreEqual(3, context.Clients.Count());
            Assert.AreEqual(4, context.Projects.Count());
            Assert.IsTrue(context.Tasks.Count() > 5);
            Assert.AreEqual(6, context.Roles.Count());
            Assert.AreEqual(6, context.Skills.Count());
            Assert.AreEqual(3, context.Teams.Count());
            Assert.AreEqual(3, context.Invoices.Count());
            Assert.IsTrue(context.Payments.Count() > 3);
        }
    }
}
