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
            orgs.Should().NotBeEmpty();
            var techCorp = orgs.FirstOrDefault(o => o.Name.Contains("TechCorp"));
            techCorp.Should().NotBeNull();
            techCorp!.Departments.Should().NotBeEmpty();
            techCorp.Departments.Should().HaveCountGreaterThan(2);
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
            depts.Should().NotBeEmpty();
            var engineering = depts.FirstOrDefault(d => d.Name.Contains("Engineering"));
            engineering.Should().NotBeNull();
            engineering!.Employees.Should().NotBeEmpty();
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
            projects.Should().NotBeEmpty();
            var project = projects.First();
            project.Tasks.Should().NotBeEmpty();
            project.Tasks.First().Id.Should().BeGreaterThan(0);
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
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Projects.Should().NotBeEmpty();
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
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Invoices.Should().NotBeEmpty();
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
            invoices.Should().NotBeEmpty();
            var invoice = invoices.First();
            invoice.Payments.Should().NotBeEmpty();
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
            teams.Should().NotBeEmpty();
            var team = teams.First();
            team.Meetings.Should().NotBeEmpty();
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
            roles.Should().NotBeEmpty();
            var role = roles.FirstOrDefault(r => r.Employees.Any());
            role.Should().NotBeNull();
            role!.Employees.Should().NotBeEmpty();
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
            employees.Should().NotBeEmpty();
            var empWithCerts = employees.FirstOrDefault(e => e.Certifications.Any());
            empWithCerts.Should().NotBeNull();
            empWithCerts!.Certifications.Should().NotBeEmpty();
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
            employees.Should().NotBeEmpty();
            var empWithTasks = employees.FirstOrDefault(e => e.Tasks.Any());
            empWithTasks.Should().NotBeNull();
            empWithTasks!.Tasks.Should().NotBeEmpty();
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
            locations.Should().NotBeEmpty();
            var location = locations.FirstOrDefault(l => l.Clients.Any());
            location.Should().NotBeNull();
            location!.Clients.Should().NotBeEmpty();
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
            depts.Should().NotBeEmpty();
            var dept = depts.First();
            dept.Organisation.Should().NotBeNull();
            dept.Organisation!.Id.Should().BeGreaterThan(0);
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
            employees.Should().NotBeEmpty();
            var emp = employees.First();
            emp.Department.Should().NotBeNull();
            emp.Department!.Name.Should().NotBeNullOrEmpty();
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
            employees.Should().NotBeEmpty();
            var emp = employees.First();
            emp.Role.Should().NotBeNull();
            emp.Role!.Title.Should().NotBeNullOrEmpty();
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
            tasks.Should().NotBeEmpty();
            var task = tasks.First();
            task.Project.Should().NotBeNull();
            task.Project!.Title.Should().NotBeNullOrEmpty();
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
            tasks.Should().NotBeEmpty();
            var assignedTask = tasks.FirstOrDefault(t => t.AssignedTo != null);
            assignedTask.Should().NotBeNull();
            assignedTask!.AssignedTo.Should().NotBeNull();
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
            projects.Should().NotBeEmpty();
            var project = projects.First();
            project.Client.Should().NotBeNull();
            project.Client!.Name.Should().NotBeNullOrEmpty();
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
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Location.Should().NotBeNull();
            client.Location!.City.Should().NotBeNullOrEmpty();
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
            employees.Should().NotBeEmpty();
            var empWithSchedule = employees.FirstOrDefault(e => e.Schedule != null);
            empWithSchedule.Should().NotBeNull();
            empWithSchedule!.Schedule.Should().NotBeNull();
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
            schedules.Should().NotBeEmpty();
            var schedule = schedules.First();
            schedule.Employee.Should().NotBeNull();
            schedule.Employee!.FirstName.Should().NotBeNullOrEmpty();
        }

        #endregion

        #region Bidirectional Relationships

        #endregion
    }
}
