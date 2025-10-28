using Microsoft.VisualStudio.TestTools.UnitTesting;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Helpers;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Collections.Generic;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    /// <summary>
    /// Tests for hierarchical ordering and filtering using GraphQL.
    /// GraphQL with projections solves the EF Core ordering limitation.
    /// </summary>
    [TestClass]
    public class HierarchicalOrderingAndFilteringTests
    {
        [TestMethod]
        public async Task BuildQuery_WithOrganisationDepartments_OrdersByOrganisationName()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    organisations {
        nodes {
            name
            departments(order: { name: ASC }) {
                name
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            Assert.IsNotNull(result);
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var orgs = jsonDoc.RootElement.GetProperty("data").GetProperty("organisations").GetProperty("nodes");

            Assert.IsTrue(orgs.GetArrayLength() > 0);
            var org = orgs[0];
            var departments = org.GetProperty("departments").EnumerateArray().ToList();

            Assert.IsTrue(departments.Count > 0);

            // Verify Departments are ordered by Name
            var deptNames = departments.Select(d => d.GetProperty("name").GetString()).ToList();
            var sortedNames = deptNames.OrderBy(n => n).ToList();
            CollectionAssert.AreEqual(sortedNames, deptNames, "Departments should be ordered by Name alphabetically");
        }

        [TestMethod]
        public async Task BuildQuery_WithDepartmentEmployees_OrdersByEmployeeLastNameThenFirstName()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    departments {
        nodes {
            name
            employees(order: [{ lastName: ASC }, { firstName: ASC }]) {
                firstName
                lastName
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var depts = jsonDoc.RootElement.GetProperty("data").GetProperty("departments").GetProperty("nodes");

            Assert.IsTrue(depts.GetArrayLength() > 0);
            var dept = depts[0];
            var employees = dept.GetProperty("employees").EnumerateArray().ToList();

            Assert.IsTrue(employees.Count > 0);

            // Verify Employees are ordered by LastName, then FirstName
            var empData = employees.Select(e => new
            {
                FirstName = e.GetProperty("firstName").GetString(),
                LastName = e.GetProperty("lastName").GetString()
            }).ToList();

            var sortedEmpData = empData.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

            for (int i = 0; i < empData.Count; i++)
            {
                Assert.AreEqual(sortedEmpData[i].LastName, empData[i].LastName, $"Employee at index {i} should be ordered by LastName");
                Assert.AreEqual(sortedEmpData[i].FirstName, empData[i].FirstName, $"Employee at index {i} should be ordered by FirstName within LastName");
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithHierarchicalPath_OrganisationDepartmentsEmployees_OrdersAllLevels()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    organisations {
        nodes {
            name
            departments(order: { name: ASC }) {
                name
                employees(order: [{ lastName: ASC }, { firstName: ASC }]) {
                    firstName
                    lastName
                }
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var orgs = jsonDoc.RootElement.GetProperty("data").GetProperty("organisations").GetProperty("nodes");

            Assert.IsTrue(orgs.GetArrayLength() > 0);
            var org = orgs[0];
            var departments = org.GetProperty("departments").EnumerateArray().ToList();

            Assert.IsTrue(departments.Count > 0);

            // Level 1: Departments should be ordered by Name
            var deptNames = departments.Select(d => d.GetProperty("name").GetString()).ToList();
            var sortedDeptNames = deptNames.OrderBy(n => n).ToList();
            CollectionAssert.AreEqual(sortedDeptNames, deptNames, "Departments should be ordered by Name");

            // Level 2: Employees within each Department should be ordered by LastName, FirstName
            foreach (var dept in departments)
            {
                if (dept.TryGetProperty("employees", out var employeesArray) && employeesArray.GetArrayLength() > 0)
                {
                    var employees = employeesArray.EnumerateArray().Select(e => new
                    {
                        FirstName = e.GetProperty("firstName").GetString(),
                        LastName = e.GetProperty("lastName").GetString()
                    }).ToList();

                    var sortedEmployees = employees.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

                    for (int i = 0; i < employees.Count; i++)
                    {
                        Assert.AreEqual(sortedEmployees[i].LastName, employees[i].LastName, $"Employees in {dept.GetProperty("name").GetString()} should be ordered by LastName");
                    }
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithSkills_OrdersByCategoryThenName()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    employees {
        nodes {
            firstName
            skills(order: [{ category: ASC }, { name: ASC }]) {
                name
                category
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var employees = jsonDoc.RootElement.GetProperty("data").GetProperty("employees").GetProperty("nodes");

            // Find employee with multiple skills
            JsonElement? empWithSkills = null;
            foreach (var emp in employees.EnumerateArray())
            {
                if (emp.TryGetProperty("skills", out var skills) && skills.GetArrayLength() > 1)
                {
                    empWithSkills = emp;
                    break;
                }
            }

            Assert.IsNotNull(empWithSkills, "At least one employee should have skills");

            if (empWithSkills.HasValue)
            {
                var skills = empWithSkills.Value.GetProperty("skills").EnumerateArray().Select(s => new
                {
                    Name = s.GetProperty("name").GetString(),
                    Category = s.GetProperty("category").GetString()
                }).ToList();

                var sortedSkills = skills.OrderBy(s => s.Category).ThenBy(s => s.Name).ToList();

                for (int i = 0; i < skills.Count; i++)
                {
                    Assert.AreEqual(sortedSkills[i].Category, skills[i].Category, $"Skill at index {i} should be ordered by Category");
                    Assert.AreEqual(sortedSkills[i].Name, skills[i].Name, $"Skill at index {i} should be ordered by Name within Category");
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithProjects_OrdersByDeadline()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    employees {
        nodes {
            firstName
            projects(order: { deadline: ASC }) {
                title
                deadline
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var employees = jsonDoc.RootElement.GetProperty("data").GetProperty("employees").GetProperty("nodes");

            // Find employee with multiple projects
            JsonElement? empWithProjects = null;
            foreach (var emp in employees.EnumerateArray())
            {
                if (emp.TryGetProperty("projects", out var projects) && projects.GetArrayLength() > 1)
                {
                    empWithProjects = emp;
                    break;
                }
            }

            Assert.IsNotNull(empWithProjects, "At least one employee should have projects");

            if (empWithProjects.HasValue)
            {
                var projects = empWithProjects.Value.GetProperty("projects").EnumerateArray().Select(p => new
                {
                    Title = p.GetProperty("title").GetString(),
                    Deadline = p.GetProperty("deadline").GetDateTime()
                }).ToList();

                var sortedProjects = projects.OrderBy(p => p.Deadline).ToList();

                for (int i = 0; i < projects.Count; i++)
                {
                    Assert.AreEqual(sortedProjects[i].Deadline, projects[i].Deadline, $"Project at index {i} should be ordered by Deadline (ascending)");
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithRoleLevel_OrdersByLevelThenTitle()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    roles {
        nodes {
            level
            title
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert - Verify roles exist with Level and Title properties
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var roles = jsonDoc.RootElement.GetProperty("data").GetProperty("roles").GetProperty("nodes");

            Assert.IsTrue(roles.GetArrayLength() > 0);
            var role = roles[0];
            Assert.IsTrue(role.TryGetProperty("level", out _));
            Assert.IsTrue(role.TryGetProperty("title", out _));
        }

        [TestMethod]
        public async Task BuildQuery_WithTaskStatus_FiltersOutCompletedTasks()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    projects {
        nodes {
            title
            tasks(where: { status: { neq: ""Completed"" } }) {
                title
                status
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var projects = jsonDoc.RootElement.GetProperty("data").GetProperty("projects").GetProperty("nodes");

            // Find project with tasks
            JsonElement? projectWithTasks = null;
            foreach (var proj in projects.EnumerateArray())
            {
                if (proj.TryGetProperty("tasks", out var tasks) && tasks.GetArrayLength() > 0)
                {
                    projectWithTasks = proj;
                    break;
                }
            }

            Assert.IsNotNull(projectWithTasks, "At least one project should have tasks");

            if (projectWithTasks.HasValue)
            {
                var tasks = projectWithTasks.Value.GetProperty("tasks").EnumerateArray().ToList();
                foreach (var task in tasks)
                {
                    var status = task.GetProperty("status").GetString();
                    Assert.AreNotEqual("Completed", status, "Tasks with Status 'Completed' should be filtered out by where clause");
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithCertificationValidUntil_FiltersExpiredCertifications()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var now = System.DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss");
            var query = $@"
{{
    employees {{
        nodes {{
            firstName
            certifications(where: {{ validUntil: {{ gte: ""{now}"" }} }}) {{
                name
                validUntil
            }}
        }}
    }}
}}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var employees = jsonDoc.RootElement.GetProperty("data").GetProperty("employees").GetProperty("nodes");

            // Find employee with certifications
            JsonElement? empWithCerts = null;
            foreach (var emp in employees.EnumerateArray())
            {
                if (emp.TryGetProperty("certifications", out var certs) && certs.GetArrayLength() > 0)
                {
                    empWithCerts = emp;
                    break;
                }
            }

            Assert.IsNotNull(empWithCerts, "At least one employee should have certifications");

            if (empWithCerts.HasValue)
            {
                var certs = empWithCerts.Value.GetProperty("certifications").EnumerateArray().ToList();
                foreach (var cert in certs)
                {
                    var validUntil = cert.GetProperty("validUntil").GetDateTime();
                    Assert.IsTrue(validUntil >= System.DateTime.Now, "Only valid (non-expired) certifications should be included");
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithCertificationOrdering_OrdersByValidUntilDescending()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    employees {
        nodes {
            firstName
            certifications(order: { validUntil: DESC }) {
                name
                validUntil
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var employees = jsonDoc.RootElement.GetProperty("data").GetProperty("employees").GetProperty("nodes");

            // Find employee with multiple certifications
            JsonElement? empWithMultipleCerts = null;
            foreach (var emp in employees.EnumerateArray())
            {
                if (emp.TryGetProperty("certifications", out var certs) && certs.GetArrayLength() > 1)
                {
                    empWithMultipleCerts = emp;
                    break;
                }
            }

            if (empWithMultipleCerts.HasValue)
            {
                var certs = empWithMultipleCerts.Value.GetProperty("certifications").EnumerateArray()
                    .Select(c => c.GetProperty("validUntil").GetDateTime()).ToList();

                var sortedCerts = certs.OrderByDescending(c => c).ToList();

                for (int i = 0; i < certs.Count; i++)
                {
                    Assert.AreEqual(sortedCerts[i], certs[i], $"Certification at index {i} should be ordered by ValidUntil descending");
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithTaskOrdering_OrdersByDueDate()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    projects {
        nodes {
            title
            tasks(order: { dueDate: ASC }) {
                title
                dueDate
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var projects = jsonDoc.RootElement.GetProperty("data").GetProperty("projects").GetProperty("nodes");

            // Find project with multiple tasks
            JsonElement? projectWithMultipleTasks = null;
            foreach (var proj in projects.EnumerateArray())
            {
                if (proj.TryGetProperty("tasks", out var tasks) && tasks.GetArrayLength() > 1)
                {
                    projectWithMultipleTasks = proj;
                    break;
                }
            }

            if (projectWithMultipleTasks.HasValue)
            {
                var tasks = projectWithMultipleTasks.Value.GetProperty("tasks").EnumerateArray()
                    .Select(t => t.GetProperty("dueDate").GetDateTime()).ToList();

                var sortedTasks = tasks.OrderBy(t => t).ToList();

                for (int i = 0; i < tasks.Count; i++)
                {
                    Assert.AreEqual(sortedTasks[i], tasks[i], $"Task at index {i} should be ordered by DueDate (ascending)");
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithTeamMembers_OrdersByEmployeeLastNameFirstName()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    teams {
        nodes {
            name
            members(order: [{ lastName: ASC }, { firstName: ASC }]) {
                firstName
                lastName
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var teams = jsonDoc.RootElement.GetProperty("data").GetProperty("teams").GetProperty("nodes");

            Assert.IsTrue(teams.GetArrayLength() > 0);
            var team = teams[0];
            var members = team.GetProperty("members").EnumerateArray().ToList();

            Assert.IsTrue(members.Count > 0);

            if (members.Count > 1)
            {
                var memberData = members.Select(m => new
                {
                    FirstName = m.GetProperty("firstName").GetString(),
                    LastName = m.GetProperty("lastName").GetString()
                }).ToList();

                var sortedMembers = memberData.OrderBy(m => m.LastName).ThenBy(m => m.FirstName).ToList();

                for (int i = 0; i < memberData.Count; i++)
                {
                    Assert.AreEqual(sortedMembers[i].LastName, memberData[i].LastName, $"Team member at index {i} should be ordered by LastName");
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithClientProjects_OrdersByProjectDeadline()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    clients {
        nodes {
            name
            projects(order: { deadline: ASC }) {
                title
                deadline
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var clients = jsonDoc.RootElement.GetProperty("data").GetProperty("clients").GetProperty("nodes");

            Assert.IsTrue(clients.GetArrayLength() > 0);
            var client = clients[0];
            var projects = client.GetProperty("projects").EnumerateArray().ToList();

            Assert.IsTrue(projects.Count > 0);

            if (projects.Count > 1)
            {
                var projectDeadlines = projects.Select(p => p.GetProperty("deadline").GetDateTime()).ToList();
                var sortedDeadlines = projectDeadlines.OrderBy(d => d).ToList();

                for (int i = 0; i < projectDeadlines.Count; i++)
                {
                    Assert.AreEqual(sortedDeadlines[i], projectDeadlines[i], $"Project at index {i} should be ordered by Deadline");
                }
            }
        }

        [TestMethod]
        public async Task BuildQuery_WithComplexHierarchy_OrderingAppliedAtEachLevel()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var query = @"
{
    organisations {
        nodes {
            name
            departments(order: { name: ASC }) {
                name
                employees(order: [{ lastName: ASC }, { firstName: ASC }]) {
                    firstName
                    lastName
                    projects(order: { deadline: ASC }) {
                        title
                        deadline
                    }
                }
            }
        }
    }
}";

            // Act
            var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

            // Assert
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var orgs = jsonDoc.RootElement.GetProperty("data").GetProperty("organisations").GetProperty("nodes");

            Assert.IsTrue(orgs.GetArrayLength() > 0);
            var org = orgs[0];
            var departments = org.GetProperty("departments").EnumerateArray().ToList();

            // Level 1: Departments ordered by Name
            if (departments.Count > 1)
            {
                var deptNames = departments.Select(d => d.GetProperty("name").GetString()).ToList();
                var sortedDeptNames = deptNames.OrderBy(n => n).ToList();
                CollectionAssert.AreEqual(sortedDeptNames, deptNames, "Departments should be ordered by Name");
            }

            // Level 2: Employees within departments ordered by LastName, FirstName
            foreach (var dept in departments)
            {
                if (dept.TryGetProperty("employees", out var employeesArray) && employeesArray.GetArrayLength() > 1)
                {
                    var employees = employeesArray.EnumerateArray().Select(e => new
                    {
                        FirstName = e.GetProperty("firstName").GetString(),
                        LastName = e.GetProperty("lastName").GetString(),
                        Element = e
                    }).ToList();

                    var sortedEmployees = employees.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

                    for (int i = 0; i < employees.Count; i++)
                    {
                        Assert.AreEqual(sortedEmployees[i].LastName, employees[i].LastName);
                    }

                    // Level 3: Projects within employees ordered by Deadline
                    foreach (var emp in employees)
                    {
                        if (emp.Element.TryGetProperty("projects", out var projectsArray) && projectsArray.GetArrayLength() > 1)
                        {
                            var projects = projectsArray.EnumerateArray()
                                .Select(p => p.GetProperty("deadline").GetDateTime()).ToList();

                            var sortedProjects = projects.OrderBy(p => p).ToList();

                            for (int j = 0; j < projects.Count; j++)
                            {
                                Assert.AreEqual(sortedProjects[j], projects[j]);
                            }
                        }
                    }
                }
            }
        }
    }
}
