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
    /// Tests all entity relationships to ensure they load correctly with BuildQuery.
    /// </summary>
    [TestClass]
    public class RelationshipTests
    {
        #region One-to-Many Relationships

        [TestMethod]
        public void BuildQuery_OrganisationToDepartments_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var orgs = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments" })
                .ToList();

            // Assert
            Assert.IsTrue(orgs.Any());
            var techCorp = orgs.FirstOrDefault(o => o.Name.Contains("TechCorp"));
            Assert.IsNotNull(techCorp);
            Assert.IsTrue(techCorp.Departments.Any());
            Assert.IsTrue(techCorp.Departments.Count() > 2);
        }

        [TestMethod]
        public void BuildQuery_DepartmentToEmployees_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var depts = context.Departments
                .BuildQuery(new HashSet<string> { "Employees" })
                .ToList();

            // Assert
            Assert.IsTrue(depts.Any());
            var engineering = depts.FirstOrDefault(d => d.Name.Contains("Engineering"));
            Assert.IsNotNull(engineering);
            Assert.IsTrue(engineering.Employees.Any());
        }

        [TestMethod]
        public void BuildQuery_ProjectToTasks_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var projects = context.Projects
                .BuildQuery(new HashSet<string> { "Tasks" })
                .ToList();

            // Assert
            Assert.IsTrue(projects.Any());
            var project = projects.First();
            Assert.IsTrue(project.Tasks.Any());
            Assert.IsTrue(project.Tasks.First().Id > 0);
        }

        [TestMethod]
        public void BuildQuery_ClientToProjects_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Projects" })
                .ToList();

            // Assert
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsTrue(client.Projects.Any());
        }

        [TestMethod]
        public void BuildQuery_ClientToInvoices_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Invoices" })
                .ToList();

            // Assert
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsTrue(client.Invoices.Any());
        }

        [TestMethod]
        public void BuildQuery_InvoiceToPayments_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var invoices = context.Invoices
                .BuildQuery(new HashSet<string> { "Payments" })
                .ToList();

            // Assert
            Assert.IsTrue(invoices.Any());
            var invoice = invoices.First();
            Assert.IsTrue(invoice.Payments.Any());
        }

        [TestMethod]
        public void BuildQuery_TeamToMeetings_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var teams = context.Teams
                .BuildQuery(new HashSet<string> { "Meetings" })
                .ToList();

            // Assert
            Assert.IsTrue(teams.Any());
            var team = teams.First();
            Assert.IsTrue(team.Meetings.Any());
        }

        [TestMethod]
        public void BuildQuery_RoleToEmployees_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var roles = context.Roles
                .BuildQuery(new HashSet<string> { "Employees" })
                .ToList();

            // Assert
            Assert.IsTrue(roles.Any());
            var role = roles.FirstOrDefault(r => r.Employees.Any());
            Assert.IsNotNull(role);
            Assert.IsTrue(role.Employees.Any());
        }

        [TestMethod]
        public void BuildQuery_EmployeeToCertifications_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Certifications" })
                .ToList();

            // Assert
            Assert.IsTrue(employees.Any());
            var empWithCerts = employees.FirstOrDefault(e => e.Certifications.Any());
            Assert.IsNotNull(empWithCerts);
            Assert.IsTrue(empWithCerts.Certifications.Any());
        }

        [TestMethod]
        public void BuildQuery_EmployeeToTasks_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Tasks" })
                .ToList();

            // Assert
            Assert.IsTrue(employees.Any());
            var empWithTasks = employees.FirstOrDefault(e => e.Tasks.Any());
            Assert.IsNotNull(empWithTasks);
            Assert.IsTrue(empWithTasks.Tasks.Any());
        }

        [TestMethod]
        public void BuildQuery_LocationToClients_LoadsOneToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var locations = context.Locations
                .BuildQuery(new HashSet<string> { "Clients" })
                .ToList();

            // Assert
            Assert.IsTrue(locations.Any());
            var location = locations.FirstOrDefault(l => l.Clients.Any());
            Assert.IsNotNull(location);
            Assert.IsTrue(location.Clients.Any());
        }

        #endregion

        #region Many-to-One Relationships

        [TestMethod]
        public void BuildQuery_DepartmentToOrganisation_LoadsManyToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var depts = context.Departments
                .BuildQuery(new HashSet<string> { "Organisation" })
                .ToList();

            // Assert
            Assert.IsTrue(depts.Any());
            var dept = depts.First();
            Assert.IsNotNull(dept.Organisation);
            Assert.IsTrue(dept.Organisation.Id > 0);
        }

        [TestMethod]
        public void BuildQuery_EmployeeToDepartment_LoadsManyToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Department" })
                .ToList();

            // Assert
            Assert.IsTrue(employees.Any());
            var emp = employees.First();
            Assert.IsNotNull(emp.Department);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department.Name));
        }

        [TestMethod]
        public void BuildQuery_EmployeeToRole_LoadsManyToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Role" })
                .ToList();

            // Assert
            Assert.IsTrue(employees.Any());
            var emp = employees.First();
            Assert.IsNotNull(emp.Role);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Role.Title));
        }

        [TestMethod]
        public void BuildQuery_TaskToProject_LoadsManyToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var tasks = context.Tasks
                .BuildQuery(new HashSet<string> { "Project" })
                .ToList();

            // Assert
            Assert.IsTrue(tasks.Any());
            var task = tasks.First();
            Assert.IsNotNull(task.Project);
            Assert.IsFalse(string.IsNullOrEmpty(task.Project.Title));
        }

        [TestMethod]
        public void BuildQuery_TaskToAssignedTo_LoadsManyToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var tasks = context.Tasks
                .BuildQuery(new HashSet<string> { "AssignedTo" })
                .ToList();

            // Assert
            Assert.IsTrue(tasks.Any());
            var assignedTask = tasks.FirstOrDefault(t => t.AssignedTo != null);
            Assert.IsNotNull(assignedTask);
            Assert.IsNotNull(assignedTask.AssignedTo);
        }

        [TestMethod]
        public void BuildQuery_ProjectToClient_LoadsManyToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var projects = context.Projects
                .BuildQuery(new HashSet<string> { "Client" })
                .ToList();

            // Assert
            Assert.IsTrue(projects.Any());
            var project = projects.First();
            Assert.IsNotNull(project.Client);
            Assert.IsFalse(string.IsNullOrEmpty(project.Client.Name));
        }

        [TestMethod]
        public void BuildQuery_ClientToLocation_LoadsManyToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Location" })
                .ToList();

            // Assert
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsNotNull(client.Location);
            Assert.IsFalse(string.IsNullOrEmpty(client.Location.City));
        }

        #endregion

        #region One-to-One Relationships

        [TestMethod]
        public void BuildQuery_EmployeeToSchedule_LoadsOneToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Schedule" })
                .ToList();

            // Assert
            Assert.IsTrue(employees.Any());
            var empWithSchedule = employees.FirstOrDefault(e => e.Schedule != null);
            Assert.IsNotNull(empWithSchedule);
            Assert.IsNotNull(empWithSchedule.Schedule);
        }

        [TestMethod]
        public void BuildQuery_ScheduleToEmployee_LoadsOneToOne()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var schedules = context.Schedules
                .BuildQuery(new HashSet<string> { "Employee" })
                .ToList();

            // Assert
            Assert.IsTrue(schedules.Any());
            var schedule = schedules.First();
            Assert.IsNotNull(schedule.Employee);
            Assert.IsFalse(string.IsNullOrEmpty(schedule.Employee.FirstName));
        }

        #endregion

        #region Bidirectional Relationships

        #endregion
    }
}
