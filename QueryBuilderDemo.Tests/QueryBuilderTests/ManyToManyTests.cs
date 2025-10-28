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
            Assert.IsTrue(employees.Any());
            var empWithProjects = employees.FirstOrDefault(e => e.Projects.Any());
            Assert.IsNotNull(empWithProjects);
            Assert.IsTrue(empWithProjects!.Projects.Any());
            Assert.IsFalse(string.IsNullOrEmpty(empWithProjects.Projects.First().Title));
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
            Assert.IsTrue(projects.Any());
            var project = projects.First();
            Assert.IsTrue(project.TeamMembers.Any());
            Assert.IsFalse(string.IsNullOrEmpty(project.TeamMembers.First().FirstName));
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
            Assert.IsTrue(employees.Any());
            var empWithProjects = employees.FirstOrDefault(e => e.Projects.Any());
            Assert.IsNotNull(empWithProjects);

            var project = empWithProjects!.Projects.First();
            Assert.IsTrue(project.TeamMembers.Any());
            // Should include the employee themselves
            Assert.IsTrue(project.TeamMembers.Any(tm => tm.Id == empWithProjects.Id));
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
            Assert.IsTrue(employees.Any());
            var empWithSkills = employees.FirstOrDefault(e => e.Skills.Any());
            Assert.IsNotNull(empWithSkills);
            Assert.IsTrue(empWithSkills!.Skills.Any());
            Assert.IsFalse(string.IsNullOrEmpty(empWithSkills.Skills.First().Name));
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
            Assert.IsTrue(skills.Any());
            var skillWithEmployees = skills.FirstOrDefault(s => s.Employees.Any());
            Assert.IsNotNull(skillWithEmployees);
            Assert.IsTrue(skillWithEmployees!.Employees.Any());
            Assert.IsFalse(string.IsNullOrEmpty(skillWithEmployees.Employees.First().FirstName));
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
            Assert.IsTrue(employees.Any());
            var empWithSkills = employees.FirstOrDefault(e => e.Skills.Any());
            Assert.IsNotNull(empWithSkills);

            var skill = empWithSkills!.Skills.First();
            Assert.IsTrue(skill.Employees.Any());
            // Should include the original employee
            Assert.IsTrue(skill.Employees.Any(e => e.Id == empWithSkills.Id));
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
            Assert.IsTrue(teams.Any());
            var team = teams.First();
            Assert.IsTrue(team.Members.Any());
            Assert.IsFalse(string.IsNullOrEmpty(team.Members.First().FirstName));
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
            Assert.IsTrue(employees.Any());
            var empWithTeams = employees.FirstOrDefault(e => e.Teams.Any());
            Assert.IsNotNull(empWithTeams);
            Assert.IsTrue(empWithTeams!.Teams.Any());
            Assert.IsFalse(string.IsNullOrEmpty(empWithTeams.Teams.First().Name));
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
            Assert.IsTrue(teams.Any());
            var team = teams.First();
            Assert.IsTrue(team.Members.Any());

            var member = team.Members.First();
            Assert.IsTrue(member.Teams.Any());
            // Should include the original team
            Assert.IsTrue(member.Teams.Any(t => t.Id == team.Id));
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
            Assert.IsTrue(employees.Any());
            var empWithProjects = employees.FirstOrDefault(e => e.Projects.Any());
            Assert.IsNotNull(empWithProjects);

            var project = empWithProjects!.Projects.First();
            Assert.IsTrue(project.TeamMembers.Any());

            var memberWithSkills = project.TeamMembers.FirstOrDefault(m => m.Skills.Any());
            if (memberWithSkills != null)
            {
                Assert.IsTrue(memberWithSkills.Skills.Any());
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
            Assert.IsTrue(teams.Any());
            var team = teams.First();
            Assert.IsTrue(team.Members.Any());

            var memberWithProjects = team.Members.FirstOrDefault(m => m.Projects.Any());
            if (memberWithProjects != null)
            {
                var project = memberWithProjects.Projects.First();
                Assert.IsTrue(project.TeamMembers.Any());
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
            Assert.IsTrue(employees.Any());
            var empWithProjects = employees.FirstOrDefault(e => e.Projects.Any());
            Assert.IsNotNull(empWithProjects);

            var project = empWithProjects!.Projects.First();
            Assert.IsNotNull(project.Client);
            Assert.IsFalse(string.IsNullOrEmpty(project.Client!.Name));
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
            Assert.IsTrue(projects.Any());
            var project = projects.First();
            Assert.IsTrue(project.TeamMembers.Any());

            var member = project.TeamMembers.First();
            Assert.IsNotNull(member.Department);
            Assert.IsNotNull(member.Department!.Organisation);
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
            Assert.IsTrue(employees.Any());
            var empWithSkills = employees.FirstOrDefault(e => e.Skills.Any());
            Assert.IsNotNull(empWithSkills);

            var skill = empWithSkills!.Skills.First();
            Assert.IsTrue(skill.Employees.Any());

            var relatedEmployee = skill.Employees.First();
            Assert.IsNotNull(relatedEmployee.Department);
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
            Assert.IsTrue(employees.Any());
            var empWithBoth = employees.FirstOrDefault(e => e.Projects.Any() && e.Skills.Any());
            Assert.IsNotNull(empWithBoth);
            Assert.IsTrue(empWithBoth!.Projects.Any());
            Assert.IsTrue(empWithBoth.Skills.Any());
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
            Assert.IsTrue(employees.Any());
            var emp = employees.FirstOrDefault(e =>
                e.Projects.Any() && e.Skills.Any() && e.Teams.Any());

            Assert.IsNotNull(emp);
            Assert.IsTrue(emp!.Projects.Any());
            Assert.IsTrue(emp.Skills.Any());
            Assert.IsTrue(emp.Teams.Any());
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
            Assert.IsTrue(clients.Any());
            var client = clients.First();
            Assert.IsTrue(client.Projects.Any());

            var project = client.Projects.First();
            Assert.IsTrue(project.TeamMembers.Any());

            var memberWithSkills = project.TeamMembers.FirstOrDefault(m => m.Skills.Any());
            if (memberWithSkills != null)
            {
                Assert.IsTrue(memberWithSkills.Skills.Any());
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
            Assert.IsTrue(orgs.Any());
            var org = orgs.First();
            Assert.IsTrue(org.Departments.Any());

            var dept = org.Departments.First();
            Assert.IsTrue(dept.Employees.Any());

            var empWithProjects = dept.Employees.FirstOrDefault(e => e.Projects.Any());
            var empWithSkills = dept.Employees.FirstOrDefault(e => e.Skills.Any());

            if (empWithProjects != null)
            {
                Assert.IsTrue(empWithProjects.Projects.Any());
            }

            if (empWithSkills != null)
            {
                Assert.IsTrue(empWithSkills.Skills.Any());
            }
        }

        #endregion
    }
}
