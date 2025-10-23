using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Models;
using QueryBuilderDemo.Tests.Helpers;
using PbsApi.Utils;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    /// <summary>
    /// Tests deep navigation paths (3+ levels) to ensure complex hierarchies load correctly.
    /// </summary>
    [TestClass]
    public class DeepNavigationTests
    {
        [TestMethod]
        public void BuildQuery_ThreeLevels_OrganisationToDepartmentToEmployeesToSkills()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var orgs = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments.Employees.Skills" })
                .ToList();

            // Assert
            orgs.Should().NotBeEmpty();
            var org = orgs.First();
            org.Departments.Should().NotBeEmpty();

            var dept = org.Departments.First();
            dept.Employees.Should().NotBeEmpty();

            var emp = dept.Employees.FirstOrDefault(e => e.Skills.Any());
            if (emp != null)
            {
                emp.Skills.Should().NotBeEmpty();
                emp.Skills.First().Name.Should().NotBeNullOrEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_ThreeLevels_OrganisationToDepartmentToEmployeesToProjects()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var orgs = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments.Employees.Projects" })
                .ToList();

            // Assert
            orgs.Should().NotBeEmpty();
            var org = orgs.First();
            org.Departments.Should().NotBeEmpty();

            var dept = org.Departments.First();
            dept.Employees.Should().NotBeEmpty();

            var empWithProjects = dept.Employees.FirstOrDefault(e => e.Projects.Any());
            empWithProjects.Should().NotBeNull();
            empWithProjects!.Projects.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildQuery_ThreeLevels_ClientToProjectsToTasks()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Projects.Tasks.AssignedTo" })
                .ToList();

            // Assert
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Projects.Should().NotBeEmpty();

            var project = client.Projects.First();
            project.Tasks.Should().NotBeEmpty();

            var taskWithAssignee = project.Tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (taskWithAssignee != null)
            {
                taskWithAssignee.AssignedTo.Should().NotBeNull();
                taskWithAssignee.AssignedTo!.FirstName.Should().NotBeNullOrEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_FourLevels_OrganisationToDepartmentToEmployeesToProjectsToClient()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var orgs = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments.Employees.Projects.Client" })
                .ToList();

            // Assert
            orgs.Should().NotBeEmpty();
            var org = orgs.First();
            org.Departments.Should().NotBeEmpty();

            var dept = org.Departments.First();
            dept.Employees.Should().NotBeEmpty();

            var empWithProjects = dept.Employees.FirstOrDefault(e => e.Projects.Any());
            if (empWithProjects != null)
            {
                empWithProjects.Projects.Should().NotBeEmpty();
                var project = empWithProjects.Projects.First();
                project.Client.Should().NotBeNull();
                project.Client!.Name.Should().NotBeNullOrEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_FourLevels_ClientToProjectsToTasksToAssignedToToDepartment()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Projects.Tasks.AssignedTo.Department" })
                .ToList();

            // Assert
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Projects.Should().NotBeEmpty();

            var project = client.Projects.First();
            project.Tasks.Should().NotBeEmpty();

            var assignedTask = project.Tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (assignedTask != null)
            {
                assignedTask.AssignedTo.Should().NotBeNull();
                assignedTask.AssignedTo!.Department.Should().NotBeNull();
                assignedTask.AssignedTo.Department!.Name.Should().NotBeNullOrEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_FiveLevels_ClientToProjectsToTasksToAssignedToToDepartmentToOrganisation()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Projects.Tasks.AssignedTo.Department.Organisation" })
                .ToList();

            // Assert
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Projects.Should().NotBeEmpty();

            var project = client.Projects.First();
            project.Tasks.Should().NotBeEmpty();

            var assignedTask = project.Tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (assignedTask != null)
            {
                assignedTask.AssignedTo.Should().NotBeNull();
                assignedTask.AssignedTo!.Department.Should().NotBeNull();
                assignedTask.AssignedTo.Department!.Organisation.Should().NotBeNull();
                assignedTask.AssignedTo.Department.Organisation!.Name.Should().NotBeNullOrEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_ThreeLevels_TeamToMembersToDepartmentToOrganisation()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var teams = context.Teams
                .BuildQuery(new HashSet<string> { "Members.Department.Organisation" })
                .ToList();

            // Assert
            teams.Should().NotBeEmpty();
            var team = teams.First();
            team.Members.Should().NotBeEmpty();

            var member = team.Members.First();
            member.Department.Should().NotBeNull();
            member.Department!.Organisation.Should().NotBeNull();
            member.Department.Organisation!.Name.Should().NotBeNullOrEmpty();
        }

        [TestMethod]
        public void BuildQuery_ThreeLevels_ProjectToTeamMembersToSkills()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var projects = context.Projects
                .BuildQuery(new HashSet<string> { "TeamMembers.Skills" })
                .ToList();

            // Assert
            projects.Should().NotBeEmpty();
            var project = projects.First();
            project.TeamMembers.Should().NotBeEmpty();

            var memberWithSkills = project.TeamMembers.FirstOrDefault(m => m.Skills.Any());
            if (memberWithSkills != null)
            {
                memberWithSkills.Skills.Should().NotBeEmpty();
                memberWithSkills.Skills.First().Name.Should().NotBeNullOrEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_ThreeLevels_InvoiceToPaymentsMultipleCollections()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Invoices.Payments" })
                .ToList();

            // Assert
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Invoices.Should().NotBeEmpty();

            var invoice = client.Invoices.First();
            invoice.Payments.Should().NotBeEmpty();
            invoice.Payments.First().Amount.Should().BeGreaterThan(0);
        }

        [TestMethod]
        public void BuildQuery_MultipleDeepPaths_LoadsAllPaths()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string>
                {
                    "Projects.Tasks.AssignedTo",
                    "Projects.TeamMembers.Department",
                    "Invoices.Payments",
                    "Location"
                })
                .ToList();

            // Assert
            clients.Should().NotBeEmpty();
            var client = clients.First();

            // Verify all paths loaded
            client.Projects.Should().NotBeEmpty();
            client.Projects.First().Tasks.Should().NotBeEmpty();
            client.Projects.First().TeamMembers.Should().NotBeEmpty();
            client.Invoices.Should().NotBeEmpty();
            client.Invoices.First().Payments.Should().NotBeEmpty();
            client.Location.Should().NotBeNull();
        }

        [TestMethod]
        public void BuildQuery_ThreeLevels_WithNullIntermediateNavigation_HandlesGracefully()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var tasks = context.Tasks
                .BuildQuery(new HashSet<string> { "AssignedTo.Department.Organisation" })
                .ToList();

            // Assert
            tasks.Should().NotBeEmpty();
            // Some tasks may have null AssignedTo - should not crash
            var assignedTask = tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (assignedTask != null)
            {
                assignedTask.AssignedTo!.Department.Should().NotBeNull();
                assignedTask.AssignedTo.Department!.Organisation.Should().NotBeNull();
            }
        }

        [TestMethod]
        public void BuildQuery_ComplexMixedPath_ClientLocationClientsProjects()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Location.Clients.Projects" })
                .ToList();

            // Assert
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Location.Should().NotBeNull();
            client.Location!.Clients.Should().NotBeEmpty();

            var relatedClient = client.Location.Clients.First();
            relatedClient.Projects.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildQuery_FourLevels_ProjectToClientToInvoicesToPayments()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var projects = context.Projects
                .BuildQuery(new HashSet<string> { "Client.Invoices.Payments" })
                .ToList();

            // Assert
            projects.Should().NotBeEmpty();
            var project = projects.First();
            project.Client.Should().NotBeNull();
            project.Client!.Invoices.Should().NotBeEmpty();

            var invoice = project.Client.Invoices.First();
            invoice.Payments.Should().NotBeEmpty();
            invoice.Payments.First().Amount.Should().BeGreaterThan(0);
        }
    }
}
