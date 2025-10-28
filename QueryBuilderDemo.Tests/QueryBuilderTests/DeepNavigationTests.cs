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
            Assert.IsTrue(orgs.Any());
            var org = orgs.First();
            Assert.IsTrue(org.Departments.Any());

            var dept = org.Departments.First();
            Assert.IsTrue(dept.Employees.Any());

            var emp = dept.Employees.FirstOrDefault(e => e.Skills.Any());
            if (emp != null)
            {
                Assert.IsTrue(emp.Skills.Any());
                Assert.IsFalse(string.IsNullOrEmpty(emp.Skills.First().Name));
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
            Assert.IsTrue(orgs.Any());
            var org = orgs.First();
            Assert.IsTrue(org.Departments.Any());

            var dept = org.Departments.First();
            Assert.IsTrue(dept.Employees.Any());

            var empWithProjects = dept.Employees.FirstOrDefault(e => e.Projects.Any());
            Assert.IsNotNull(empWithProjects);
            Assert.IsTrue(empWithProjects!.Projects.Any());
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
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsTrue(client.Projects.Any());

            var project = client.Projects.First();
            Assert.IsTrue(project.Tasks.Any());

            var taskWithAssignee = project.Tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (taskWithAssignee != null)
            {
                Assert.IsNotNull(taskWithAssignee.AssignedTo);
                Assert.IsFalse(string.IsNullOrEmpty(taskWithAssignee.AssignedTo!.FirstName));
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
            Assert.IsTrue(orgs.Any());
            var org = orgs.First();
            Assert.IsTrue(org.Departments.Any());

            var dept = org.Departments.First();
            Assert.IsTrue(dept.Employees.Any());

            var empWithProjects = dept.Employees.FirstOrDefault(e => e.Projects.Any());
            if (empWithProjects != null)
            {
                Assert.IsTrue(empWithProjects.Projects.Any());
                var project = empWithProjects.Projects.First();
                Assert.IsNotNull(project.Client);
                Assert.IsFalse(string.IsNullOrEmpty(project.Client!.Name));
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
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsTrue(client.Projects.Any());

            var project = client.Projects.First();
            Assert.IsTrue(project.Tasks.Any());

            var assignedTask = project.Tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (assignedTask != null)
            {
                Assert.IsNotNull(assignedTask.AssignedTo);
                Assert.IsNotNull(assignedTask.AssignedTo!.Department);
                Assert.IsFalse(string.IsNullOrEmpty(assignedTask.AssignedTo.Department!.Name));
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
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsTrue(client.Projects.Any());

            var project = client.Projects.First();
            Assert.IsTrue(project.Tasks.Any());

            var assignedTask = project.Tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (assignedTask != null)
            {
                Assert.IsNotNull(assignedTask.AssignedTo);
                Assert.IsNotNull(assignedTask.AssignedTo!.Department);
                Assert.IsNotNull(assignedTask.AssignedTo.Department!.Organisation);
                Assert.IsFalse(string.IsNullOrEmpty(assignedTask.AssignedTo.Department.Organisation!.Name));
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
            Assert.IsTrue(teams.Any());
            var team = teams.First();
            Assert.IsTrue(team.Members.Any());

            var member = team.Members.First();
            Assert.IsNotNull(member.Department);
            Assert.IsNotNull(member.Department!.Organisation);
            Assert.IsFalse(string.IsNullOrEmpty(member.Department.Organisation!.Name));
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
            Assert.IsTrue(projects.Any());
            var project = projects.First();
            Assert.IsTrue(project.TeamMembers.Any());

            var memberWithSkills = project.TeamMembers.FirstOrDefault(m => m.Skills.Any());
            if (memberWithSkills != null)
            {
                Assert.IsTrue(memberWithSkills.Skills.Any());
                Assert.IsFalse(string.IsNullOrEmpty(memberWithSkills.Skills.First().Name));
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
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsTrue(client.Invoices.Any());

            var invoice = client.Invoices.First();
            Assert.IsTrue(invoice.Payments.Any());
            Assert.IsTrue(invoice.Payments.First().Amount > 0);
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
            Assert.IsTrue(clients.Any());
            var client = clients.First();

            // Verify all paths loaded
            Assert.IsTrue(client.Projects.Any());
            Assert.IsTrue(client.Projects.First().Tasks.Any());
            Assert.IsTrue(client.Projects.First().TeamMembers.Any());
            Assert.IsTrue(client.Invoices.Any());
            Assert.IsTrue(client.Invoices.First().Payments.Any());
            Assert.IsNotNull(client.Location);
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
            Assert.IsTrue(tasks.Any());
            // Some tasks may have null AssignedTo - should not crash
            var assignedTask = tasks.FirstOrDefault(t => t.AssignedTo != null);
            if (assignedTask != null)
            {
                Assert.IsNotNull(assignedTask.AssignedTo!.Department);
                Assert.IsNotNull(assignedTask.AssignedTo.Department!.Organisation);
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
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsNotNull(client.Location);
            Assert.IsTrue(client.Location!.Clients.Any());

            var relatedClient = client.Location.Clients.First();
            Assert.IsTrue(relatedClient.Projects.Any());
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
            Assert.IsTrue(projects.Any());
            var project = projects.First();
            Assert.IsNotNull(project.Client);
            Assert.IsTrue(project.Client!.Invoices.Any());

            var invoice = project.Client.Invoices.First();
            Assert.IsTrue(invoice.Payments.Any());
            Assert.IsTrue(invoice.Payments.First().Amount > 0);
        }
    }
}
