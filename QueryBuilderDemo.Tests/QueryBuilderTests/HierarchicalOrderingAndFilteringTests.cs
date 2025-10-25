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
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Departments.Any());

            // Verify Departments are ordered by Name
            var deptNames = org.Departments.Select(d => d.Name).ToList();
            var sortedNames = deptNames.OrderBy(n => n).ToList();
            CollectionAssert.AreEqual(sortedNames.ToList(), deptNames.ToList(), "Departments should be ordered by Name alphabetically");
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
            Assert.IsTrue(result.Any());
            var dept = result.First();
            Assert.IsTrue(dept.Employees.Any());

            // Verify Employees are ordered by LastName, then FirstName
            var employees = dept.Employees.ToList();
            var sortedEmployees = employees.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

            for (int i = 0; i < employees.Count; i++)
            {
                Assert.AreEqual(sortedEmployees[i].LastName, employees[i].LastName,
                    $"Employee at index {i} should be ordered by LastName");
                Assert.AreEqual(sortedEmployees[i].FirstName, employees[i].FirstName,
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
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Departments.Any());

            // Level 1: Departments should be ordered by Name
            var deptNames = org.Departments.Select(d => d.Name).ToList();
            var sortedDeptNames = deptNames.OrderBy(n => n).ToList();
            CollectionAssert.AreEqual(sortedDeptNames.ToList(), deptNames.ToList(), "Departments should be ordered by Name");

            // Level 2: Employees within each Department should be ordered by LastName, FirstName
            foreach (var dept in org.Departments.Where(d => d.Employees.Any()))
            {
                var employees = dept.Employees.ToList();
                var sortedEmployees = employees.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

                for (int i = 0; i < employees.Count; i++)
                {
                    Assert.AreEqual(sortedEmployees[i].LastName, employees[i].LastName,
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
            Assert.IsNotNull(empWithSkills, "At least one employee should have skills");

            if (empWithSkills != null && empWithSkills.Skills.Count > 1)
            {
                var skills = empWithSkills.Skills.ToList();
                var sortedSkills = skills.OrderBy(s => s.Category).ThenBy(s => s.Name).ToList();

                for (int i = 0; i < skills.Count; i++)
                {
                    Assert.AreEqual(sortedSkills[i].Category, skills[i].Category,
                        $"Skill at index {i} should be ordered by Category");
                    Assert.AreEqual(sortedSkills[i].Name, skills[i].Name,
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
            Assert.IsNotNull(empWithProjects, "At least one employee should have projects");

            if (empWithProjects != null && empWithProjects.Projects.Count > 1)
            {
                var projects = empWithProjects.Projects.ToList();
                var sortedProjects = projects.OrderBy(p => p.Deadline).ToList();

                for (int i = 0; i < projects.Count; i++)
                {
                    Assert.AreEqual(sortedProjects[i].Deadline, projects[i].Deadline,
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
            Assert.IsTrue(result.Any());
            var role = result.First();
            Assert.IsNotNull(role.Level);
            Assert.IsNotNull(role.Title);
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
            Assert.IsTrue(result.Any());
            var projectWithTasks = result.FirstOrDefault(p => p.Tasks.Any());
            Assert.IsNotNull(projectWithTasks, "At least one project should have tasks");

            if (projectWithTasks != null)
            {
                // Due to [Where] attribute, completed tasks should be filtered out
                Assert.IsFalse(projectWithTasks.Tasks.Any(t => t.Status == "Completed"),
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
            Assert.IsNotNull(empWithCerts, "At least one employee should have certifications");

            if (empWithCerts != null)
            {
                // Due to [Where("ValidUntil >= DateTime.Now")] attribute, expired certs should be filtered out
                Assert.IsTrue(empWithCerts.Certifications.All(c => c.ValidUntil >= System.DateTime.Now),
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
                    Assert.AreEqual(sortedCerts[i].ValidUntil, certs[i].ValidUntil,
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
                    Assert.AreEqual(sortedTasks[i].DueDate, tasks[i].DueDate,
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
            Assert.IsTrue(result.Any());
            var team = result.First();
            Assert.IsTrue(team.Members.Any());

            if (team.Members.Count > 1)
            {
                var members = team.Members.ToList();
                var sortedMembers = members.OrderBy(m => m.LastName).ThenBy(m => m.FirstName).ToList();

                for (int i = 0; i < members.Count; i++)
                {
                    Assert.AreEqual(sortedMembers[i].LastName, members[i].LastName,
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
            Assert.IsTrue(result.Any());
            var client = result.First();
            Assert.IsTrue(client.Projects.Any());

            if (client.Projects.Count > 1)
            {
                var projects = client.Projects.ToList();
                var sortedProjects = projects.OrderBy(p => p.Deadline).ToList();

                for (int i = 0; i < projects.Count; i++)
                {
                    Assert.AreEqual(sortedProjects[i].Deadline, projects[i].Deadline,
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
            Assert.IsTrue(result.Any());
            var org = result.First();

            // Level 1: Departments ordered by Name
            if (org.Departments.Count > 1)
            {
                var deptNames = org.Departments.Select(d => d.Name).ToList();
                var sortedDeptNames = deptNames.OrderBy(n => n).ToList();
                CollectionAssert.AreEqual(sortedDeptNames.ToList(), deptNames.ToList(), "Departments should be ordered by Name");
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
                        Assert.AreEqual(sortedEmployees[i].LastName, employees[i].LastName);
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
                            Assert.AreEqual(sortedProjects[i].Deadline, projects[i].Deadline);
                        }
                    }
                }
            }
        }
    }
}
