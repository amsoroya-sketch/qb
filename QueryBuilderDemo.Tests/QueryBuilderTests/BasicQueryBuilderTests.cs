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
            result.Should().NotBeEmpty();
            result.Should().HaveCountGreaterThan(0);
            result.First().Departments.Should().NotBeEmpty();
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
            result.Should().NotBeEmpty();
            result.First().Departments.Should().NotBeEmpty();
            result.First().Departments.First().Employees.Should().NotBeEmpty();
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
            result.Should().NotBeEmpty();
            var firstOrg = result.First();
            firstOrg.Departments.Should().NotBeEmpty();

            var firstDept = firstOrg.Departments.First();
            firstDept.Employees.Should().NotBeEmpty();

            var firstEmployee = firstDept.Employees.First();
            firstEmployee.Role.Should().NotBeNull();
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
            result.Should().NotBeEmpty();
            var employee = result.First();
            employee.Department.Should().NotBeNull();
            employee.Department!.Organisation.Should().NotBeNull();
            employee.Role.Should().NotBeNull();
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
            result.Should().NotBeEmpty();
            var project = result.First();
            project.Tasks.Should().NotBeEmpty();
            project.TeamMembers.Should().NotBeEmpty();
            project.Client.Should().NotBeNull();
            project.Client!.Location.Should().NotBeNull();
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
            result.Should().NotBeEmpty();
            var client = result.First();
            client.Location.Should().NotBeNull();
            client.Projects.Should().NotBeEmpty();
            client.Invoices.Should().NotBeEmpty();
            client.Invoices.First().Payments.Should().NotBeEmpty();
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
            result.Should().NotBeEmpty();
            var team = result.First();
            team.Members.Should().NotBeEmpty();
            team.Meetings.Should().NotBeEmpty();
        }

        [TestMethod]
        public void SampleData_HasCorrectCounts()
        {
            // Arrange & Act
            using var context = TestDbContextFactory.CreateSeededContext();

            // Assert - verify all data was seeded
            context.Organisations.Should().HaveCount(2);
            context.Departments.Should().HaveCount(6);
            context.Employees.Should().HaveCount(6);
            context.Locations.Should().HaveCount(3);
            context.Clients.Should().HaveCount(3);
            context.Projects.Should().HaveCount(4);
            context.Tasks.Should().HaveCountGreaterThan(5);
            context.Roles.Should().HaveCount(6);
            context.Skills.Should().HaveCount(6);
            context.Teams.Should().HaveCount(3);
            context.Invoices.Should().HaveCount(3);
            context.Payments.Should().HaveCountGreaterThan(3);
        }
    }
}
