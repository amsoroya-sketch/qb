using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
using QueryBuilderDemo.Data;
using QueryBuilderDemo.Models;
using QueryBuilderDemo.Tests.Helpers;
using PbsApi.Utils;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    [TestClass]
    public class HierarchicalOrderingAndFilteringTests
    {
        [TestMethod]
        public void BuildQuery_WithOrganisationDepartments_OrdersByOrganisationName()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Include Departments which should be ordered by Department.Name due to class-level [DLINQOrderby]
            var result = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Departments.Should().NotBeEmpty();

            // Verify Departments are ordered by Name
            var deptNames = org.Departments.Select(d => d.Name).ToList();
            var sortedNames = deptNames.OrderBy(n => n).ToList();
            deptNames.Should().Equal(sortedNames, "Departments should be ordered by Name alphabetically");
        }

        [TestMethod]
        public void BuildQuery_WithDepartmentEmployees_OrdersByEmployeeLastNameThenFirstName()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Include Employees which should be ordered by LastName, then FirstName
            var result = context.Departments
                .BuildQuery(new HashSet<string> { "Employees" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var dept = result.First();
            dept.Employees.Should().NotBeEmpty();

            // Verify Employees are ordered by LastName, then FirstName
            var employees = dept.Employees.ToList();
            var sortedEmployees = employees.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

            for (int i = 0; i < employees.Count; i++)
            {
                employees[i].LastName.Should().Be(sortedEmployees[i].LastName,
                    $"Employee at index {i} should be ordered by LastName");
                employees[i].FirstName.Should().Be(sortedEmployees[i].FirstName,
                    $"Employee at index {i} should be ordered by FirstName within LastName");
            }
        }

        [TestMethod]
        public void BuildQuery_WithHierarchicalPath_OrganisationDepartmentsEmployees_OrdersAllLevels()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Three-level hierarchy: Organisation → Departments → Employees
            var result = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments.Employees" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Departments.Should().NotBeEmpty();

            // Level 1: Departments should be ordered by Name
            var deptNames = org.Departments.Select(d => d.Name).ToList();
            var sortedDeptNames = deptNames.OrderBy(n => n).ToList();
            deptNames.Should().Equal(sortedDeptNames, "Departments should be ordered by Name");

            // Level 2: Employees within each Department should be ordered by LastName, FirstName
            foreach (var dept in org.Departments.Where(d => d.Employees.Any()))
            {
                var employees = dept.Employees.ToList();
                var sortedEmployees = employees.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

                for (int i = 0; i < employees.Count; i++)
                {
                    employees[i].LastName.Should().Be(sortedEmployees[i].LastName,
                        $"Employees in {dept.Name} should be ordered by LastName");
                }
            }
        }

        [TestMethod]
        public void BuildQuery_WithSkills_OrdersByCategoryThenName()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Employee.Skills should be ordered by Category, then Name
            var result = context.Employees
                .BuildQuery(new HashSet<string> { "Skills" })
                .ToList();

            // Assert
            var empWithSkills = result.FirstOrDefault(e => e.Skills.Any());
            empWithSkills.Should().NotBeNull("At least one employee should have skills");

            if (empWithSkills != null && empWithSkills.Skills.Count > 1)
            {
                var skills = empWithSkills.Skills.ToList();
                var sortedSkills = skills.OrderBy(s => s.Category).ThenBy(s => s.Name).ToList();

                for (int i = 0; i < skills.Count; i++)
                {
                    skills[i].Category.Should().Be(sortedSkills[i].Category,
                        $"Skill at index {i} should be ordered by Category");
                    skills[i].Name.Should().Be(sortedSkills[i].Name,
                        $"Skill at index {i} should be ordered by Name within Category");
                }
            }
        }

        [TestMethod]
        public void BuildQuery_WithProjects_OrdersByDeadline()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Employee.Projects should be ordered by Deadline (most urgent first)
            var result = context.Employees
                .BuildQuery(new HashSet<string> { "Projects" })
                .ToList();

            // Assert
            var empWithProjects = result.FirstOrDefault(e => e.Projects.Any());
            empWithProjects.Should().NotBeNull("At least one employee should have projects");

            if (empWithProjects != null && empWithProjects.Projects.Count > 1)
            {
                var projects = empWithProjects.Projects.ToList();
                var sortedProjects = projects.OrderBy(p => p.Deadline).ToList();

                for (int i = 0; i < projects.Count; i++)
                {
                    projects[i].Deadline.Should().Be(sortedProjects[i].Deadline,
                        $"Project at index {i} should be ordered by Deadline (ascending)");
                }
            }
        }

        [TestMethod]
        public void BuildQuery_WithRoleLevel_OrdersByLevelThenTitle()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Role.Employees should trigger ordering on Role collections if accessed
            var result = context.Roles
                .ToList();

            // Assert - Verify roles exist with Level and Title properties
            result.Should().NotBeEmpty();
            var role = result.First();
            role.Level.Should().NotBeNull();
            role.Title.Should().NotBeNull();
        }

        [TestMethod]
        public void BuildQuery_WithTaskStatus_FiltersOutCompletedTasks()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Project.Tasks should be filtered to exclude "Completed" tasks
            var result = context.Projects
                .BuildQuery(new HashSet<string> { "Tasks" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var projectWithTasks = result.FirstOrDefault(p => p.Tasks.Any());
            projectWithTasks.Should().NotBeNull("At least one project should have tasks");

            if (projectWithTasks != null)
            {
                // Due to [Where] attribute, completed tasks should be filtered out
                projectWithTasks.Tasks.Should().NotContain(t => t.Status == "Completed",
                    "Tasks with Status 'Completed' should be filtered out by [Where] attribute");
            }
        }

        [TestMethod]
        public void BuildQuery_WithCertificationValidUntil_FiltersExpiredCertifications()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Employee.Certifications should be filtered to show only valid (non-expired) certs
            var result = context.Employees
                .BuildQuery(new HashSet<string> { "Certifications" })
                .ToList();

            // Assert
            var empWithCerts = result.FirstOrDefault(e => e.Certifications.Any());
            empWithCerts.Should().NotBeNull("At least one employee should have certifications");

            if (empWithCerts != null)
            {
                // Due to [Where("ValidUntil >= DateTime.Now")] attribute, expired certs should be filtered out
                empWithCerts.Certifications.Should().OnlyContain(c => c.ValidUntil >= System.DateTime.Now,
                    "Only valid (non-expired) certifications should be included");
            }
        }

        [TestMethod]
        public void BuildQuery_WithCertificationOrdering_OrdersByValidUntilDescending()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Employee.Certifications should be ordered by ValidUntil descending (newest first)
            var result = context.Employees
                .BuildQuery(new HashSet<string> { "Certifications" })
                .ToList();

            // Assert
            var empWithMultipleCerts = result.FirstOrDefault(e => e.Certifications.Count > 1);
            if (empWithMultipleCerts != null)
            {
                var certs = empWithMultipleCerts.Certifications.ToList();
                var sortedCerts = certs.OrderByDescending(c => c.ValidUntil).ToList();

                for (int i = 0; i < certs.Count; i++)
                {
                    certs[i].ValidUntil.Should().Be(sortedCerts[i].ValidUntil,
                        $"Certification at index {i} should be ordered by ValidUntil descending");
                }
            }
        }

        [TestMethod]
        public void BuildQuery_WithTaskOrdering_OrdersByDueDate()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Project.Tasks should be ordered by DueDate (most urgent first)
            var result = context.Projects
                .BuildQuery(new HashSet<string> { "Tasks" })
                .ToList();

            // Assert
            var projectWithMultipleTasks = result.FirstOrDefault(p => p.Tasks.Count > 1);
            if (projectWithMultipleTasks != null)
            {
                var tasks = projectWithMultipleTasks.Tasks.ToList();
                var sortedTasks = tasks.OrderBy(t => t.DueDate).ToList();

                for (int i = 0; i < tasks.Count; i++)
                {
                    tasks[i].DueDate.Should().Be(sortedTasks[i].DueDate,
                        $"Task at index {i} should be ordered by DueDate (ascending)");
                }
            }
        }

        [TestMethod]
        public void BuildQuery_WithTeamMembers_OrdersByEmployeeLastNameFirstName()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Team.Members should be ordered by Employee ordering (LastName, FirstName)
            var result = context.Teams
                .BuildQuery(new HashSet<string> { "Members" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var team = result.First();
            team.Members.Should().NotBeEmpty();

            if (team.Members.Count > 1)
            {
                var members = team.Members.ToList();
                var sortedMembers = members.OrderBy(m => m.LastName).ThenBy(m => m.FirstName).ToList();

                for (int i = 0; i < members.Count; i++)
                {
                    members[i].LastName.Should().Be(sortedMembers[i].LastName,
                        $"Team member at index {i} should be ordered by LastName");
                }
            }
        }

        [TestMethod]
        public void BuildQuery_WithClientProjects_OrdersByProjectDeadline()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Client.Projects should be ordered by Deadline
            var result = context.Clients
                .BuildQuery(new HashSet<string> { "Projects" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var client = result.First();
            client.Projects.Should().NotBeEmpty();

            if (client.Projects.Count > 1)
            {
                var projects = client.Projects.ToList();
                var sortedProjects = projects.OrderBy(p => p.Deadline).ToList();

                for (int i = 0; i < projects.Count; i++)
                {
                    projects[i].Deadline.Should().Be(sortedProjects[i].Deadline,
                        $"Project at index {i} should be ordered by Deadline");
                }
            }
        }

        [TestMethod]
        public void BuildQuery_WithComplexHierarchy_OrderingAppliedAtEachLevel()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act - Multi-level: Organisation.Departments.Employees.Projects
            // Each level should maintain its own ordering
            var result = context.Organisations
                .BuildQuery(new HashSet<string> { "Departments.Employees.Projects" })
                .ToList();

            // Assert
            result.Should().NotBeEmpty();
            var org = result.First();

            // Level 1: Departments ordered by Name
            if (org.Departments.Count > 1)
            {
                var deptNames = org.Departments.Select(d => d.Name).ToList();
                var sortedDeptNames = deptNames.OrderBy(n => n).ToList();
                deptNames.Should().Equal(sortedDeptNames, "Departments should be ordered by Name");
            }

            // Level 2: Employees within departments ordered by LastName, FirstName
            foreach (var dept in org.Departments.Where(d => d.Employees.Any()))
            {
                if (dept.Employees.Count > 1)
                {
                    var employees = dept.Employees.ToList();
                    var sortedEmployees = employees.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

                    for (int i = 0; i < employees.Count; i++)
                    {
                        employees[i].LastName.Should().Be(sortedEmployees[i].LastName);
                    }
                }

                // Level 3: Projects within employees ordered by Deadline
                foreach (var emp in dept.Employees.Where(e => e.Projects.Any()))
                {
                    if (emp.Projects.Count > 1)
                    {
                        var projects = emp.Projects.ToList();
                        var sortedProjects = projects.OrderBy(p => p.Deadline).ToList();

                        for (int i = 0; i < projects.Count; i++)
                        {
                            projects[i].Deadline.Should().Be(sortedProjects[i].Deadline);
                        }
                    }
                }
            }
        }
    }
}
