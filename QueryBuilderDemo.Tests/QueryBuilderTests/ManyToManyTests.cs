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
    /// Tests specifically focused on many-to-many relationships.
    /// </summary>
    [TestClass]
    public class ManyToManyTests
    {
        #region Employee <-> Projects

        [TestMethod]
        public void BuildQuery_EmployeeProjects_LoadsManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Projects" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithProjects = employees.FirstOrDefault(e => e.Projects.Any());
            empWithProjects.Should().NotBeNull();
            empWithProjects!.Projects.Should().NotBeEmpty();
            empWithProjects.Projects.First().Title.Should().NotBeNullOrEmpty();
        }

        [TestMethod]
        public void BuildQuery_ProjectTeamMembers_LoadsManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var projects = context.Projects
                .BuildQuery(new HashSet<string> { "TeamMembers" })
                .ToList();

            // Assert
            projects.Should().NotBeEmpty();
            var project = projects.First();
            project.TeamMembers.Should().NotBeEmpty();
            project.TeamMembers.First().FirstName.Should().NotBeNullOrEmpty();
        }

        [TestMethod]
        public void BuildQuery_BidirectionalManyToMany_EmployeeProjectsTeamMembers()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Projects.TeamMembers" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithProjects = employees.FirstOrDefault(e => e.Projects.Any());
            empWithProjects.Should().NotBeNull();

            var project = empWithProjects!.Projects.First();
            project.TeamMembers.Should().NotBeEmpty();
            // Should include the employee themselves
            project.TeamMembers.Should().Contain(tm => tm.Id == empWithProjects.Id);
        }

        #endregion

        #region Employee <-> Skills

        [TestMethod]
        public void BuildQuery_EmployeeSkills_LoadsManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Skills" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithSkills = employees.FirstOrDefault(e => e.Skills.Any());
            empWithSkills.Should().NotBeNull();
            empWithSkills!.Skills.Should().NotBeEmpty();
            empWithSkills.Skills.First().Name.Should().NotBeNullOrEmpty();
        }

        [TestMethod]
        public void BuildQuery_SkillEmployees_LoadsManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var skills = context.Skills
                .BuildQuery(new HashSet<string> { "Employees" })
                .ToList();

            // Assert
            skills.Should().NotBeEmpty();
            var skillWithEmployees = skills.FirstOrDefault(s => s.Employees.Any());
            skillWithEmployees.Should().NotBeNull();
            skillWithEmployees!.Employees.Should().NotBeEmpty();
            skillWithEmployees.Employees.First().FirstName.Should().NotBeNullOrEmpty();
        }

        [TestMethod]
        public void BuildQuery_EmployeeSkillsEmployees_BidirectionalManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Skills.Employees" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithSkills = employees.FirstOrDefault(e => e.Skills.Any());
            empWithSkills.Should().NotBeNull();

            var skill = empWithSkills!.Skills.First();
            skill.Employees.Should().NotBeEmpty();
            // Should include the original employee
            skill.Employees.Should().Contain(e => e.Id == empWithSkills.Id);
        }

        #endregion

        #region Team <-> Employees (Members)

        [TestMethod]
        public void BuildQuery_TeamMembers_LoadsManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var teams = context.Teams
                .BuildQuery(new HashSet<string> { "Members" })
                .ToList();

            // Assert
            teams.Should().NotBeEmpty();
            var team = teams.First();
            team.Members.Should().NotBeEmpty();
            team.Members.First().FirstName.Should().NotBeNullOrEmpty();
        }

        [TestMethod]
        public void BuildQuery_EmployeeTeams_LoadsManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Teams" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithTeams = employees.FirstOrDefault(e => e.Teams.Any());
            empWithTeams.Should().NotBeNull();
            empWithTeams!.Teams.Should().NotBeEmpty();
            empWithTeams.Teams.First().Name.Should().NotBeNullOrEmpty();
        }

        [TestMethod]
        public void BuildQuery_TeamMembersTeams_BidirectionalManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var teams = context.Teams
                .BuildQuery(new HashSet<string> { "Members.Teams" })
                .ToList();

            // Assert
            teams.Should().NotBeEmpty();
            var team = teams.First();
            team.Members.Should().NotBeEmpty();

            var member = team.Members.First();
            member.Teams.Should().NotBeEmpty();
            // Should include the original team
            member.Teams.Should().Contain(t => t.Id == team.Id);
        }

        #endregion

        #region Nested Many-to-Many

        [TestMethod]
        public void BuildQuery_NestedManyToMany_ProjectTeamMembersSkills()
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
        public void BuildQuery_NestedManyToMany_EmployeeProjectsTeamMembersSkills()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Projects.TeamMembers.Skills" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithProjects = employees.FirstOrDefault(e => e.Projects.Any());
            empWithProjects.Should().NotBeNull();

            var project = empWithProjects!.Projects.First();
            project.TeamMembers.Should().NotBeEmpty();

            var memberWithSkills = project.TeamMembers.FirstOrDefault(m => m.Skills.Any());
            if (memberWithSkills != null)
            {
                memberWithSkills.Skills.Should().NotBeEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_NestedManyToMany_TeamMembersProjectsTeamMembers()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var teams = context.Teams
                .BuildQuery(new HashSet<string> { "Members.Projects.TeamMembers" })
                .ToList();

            // Assert
            teams.Should().NotBeEmpty();
            var team = teams.First();
            team.Members.Should().NotBeEmpty();

            var memberWithProjects = team.Members.FirstOrDefault(m => m.Projects.Any());
            if (memberWithProjects != null)
            {
                var project = memberWithProjects.Projects.First();
                project.TeamMembers.Should().NotBeEmpty();
            }
        }

        #endregion

        #region Many-to-Many with Additional Navigation

        [TestMethod]
        public void BuildQuery_ManyToManyWithNavigation_EmployeeProjectsClient()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Projects.Client" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithProjects = employees.FirstOrDefault(e => e.Projects.Any());
            empWithProjects.Should().NotBeNull();

            var project = empWithProjects!.Projects.First();
            project.Client.Should().NotBeNull();
            project.Client!.Name.Should().NotBeNullOrEmpty();
        }

        [TestMethod]
        public void BuildQuery_ManyToManyWithNavigation_ProjectTeamMembersDepartment()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var projects = context.Projects
                .BuildQuery(new HashSet<string> { "TeamMembers.Department.Organisation" })
                .ToList();

            // Assert
            projects.Should().NotBeEmpty();
            var project = projects.First();
            project.TeamMembers.Should().NotBeEmpty();

            var member = project.TeamMembers.First();
            member.Department.Should().NotBeNull();
            member.Department!.Organisation.Should().NotBeNull();
        }

        [TestMethod]
        public void BuildQuery_ManyToManyWithNavigation_EmployeeSkillsEmployeesDepartment()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Skills.Employees.Department" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithSkills = employees.FirstOrDefault(e => e.Skills.Any());
            empWithSkills.Should().NotBeNull();

            var skill = empWithSkills!.Skills.First();
            skill.Employees.Should().NotBeEmpty();

            var relatedEmployee = skill.Employees.First();
            relatedEmployee.Department.Should().NotBeNull();
        }

        #endregion

        #region Multiple Many-to-Many on Same Entity

        [TestMethod]
        public void BuildQuery_MultipleManyToMany_EmployeeProjectsAndSkills()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Projects", "Skills" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var empWithBoth = employees.FirstOrDefault(e => e.Projects.Any() && e.Skills.Any());
            empWithBoth.Should().NotBeNull();
            empWithBoth!.Projects.Should().NotBeEmpty();
            empWithBoth.Skills.Should().NotBeEmpty();
        }

        [TestMethod]
        public void BuildQuery_MultipleManyToMany_EmployeeProjectsSkillsAndTeams()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var employees = context.Employees
                .BuildQuery(new HashSet<string> { "Projects", "Skills", "Teams" })
                .ToList();

            // Assert
            employees.Should().NotBeEmpty();
            var emp = employees.FirstOrDefault(e =>
                e.Projects.Any() && e.Skills.Any() && e.Teams.Any());

            emp.Should().NotBeNull();
            emp!.Projects.Should().NotBeEmpty();
            emp.Skills.Should().NotBeEmpty();
            emp.Teams.Should().NotBeEmpty();
        }

        #endregion

        #region Complex Many-to-Many Scenarios

        [TestMethod]
        public void BuildQuery_ComplexManyToMany_ClientProjectsTeamMembersSkills()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var clients = context.Clients
                .BuildQuery(new HashSet<string> { "Projects.TeamMembers.Skills" })
                .ToList();

            // Assert
            clients.Should().NotBeEmpty();
            var client = clients.First();
            client.Projects.Should().NotBeEmpty();

            var project = client.Projects.First();
            project.TeamMembers.Should().NotBeEmpty();

            var memberWithSkills = project.TeamMembers.FirstOrDefault(m => m.Skills.Any());
            if (memberWithSkills != null)
            {
                memberWithSkills.Skills.Should().NotBeEmpty();
            }
        }

        [TestMethod]
        public void BuildQuery_ComplexManyToMany_OrganisationDepartmentsEmployeesProjectsAndSkills()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act
            var orgs = context.Organisations
                .BuildQuery(new HashSet<string>
                {
                    "Departments.Employees.Projects",
                    "Departments.Employees.Skills"
                })
                .ToList();

            // Assert
            orgs.Should().NotBeEmpty();
            var org = orgs.First();
            org.Departments.Should().NotBeEmpty();

            var dept = org.Departments.First();
            dept.Employees.Should().NotBeEmpty();

            var empWithProjects = dept.Employees.FirstOrDefault(e => e.Projects.Any());
            var empWithSkills = dept.Employees.FirstOrDefault(e => e.Skills.Any());

            if (empWithProjects != null)
            {
                empWithProjects.Projects.Should().NotBeEmpty();
            }

            if (empWithSkills != null)
            {
                empWithSkills.Skills.Should().NotBeEmpty();
            }
        }

        #endregion
    }
}
