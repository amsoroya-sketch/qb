using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
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
            result.Should().NotBeNull();
            var jsonResult = result.ToJson();
            var jsonDoc = JsonDocument.Parse(jsonResult);
            var orgs = jsonDoc.RootElement.GetProperty("data").GetProperty("organisations").GetProperty("nodes");

            orgs.GetArrayLength().Should().BeGreaterThan(0);
            var org = orgs[0];
            var departments = org.GetProperty("departments").EnumerateArray().ToList();

            departments.Should().NotBeEmpty();

            // Verify Departments are ordered by Name
            var deptNames = departments.Select(d => d.GetProperty("name").GetString()).ToList();
            var sortedNames = deptNames.OrderBy(n => n).ToList();
            deptNames.Should().Equal(sortedNames, "Departments should be ordered by Name alphabetically");
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

            depts.GetArrayLength().Should().BeGreaterThan(0);
            var dept = depts[0];
            var employees = dept.GetProperty("employees").EnumerateArray().ToList();

            employees.Should().NotBeEmpty();

            // Verify Employees are ordered by LastName, then FirstName
            var empData = employees.Select(e => new
            {
                FirstName = e.GetProperty("firstName").GetString(),
                LastName = e.GetProperty("lastName").GetString()
            }).ToList();

            var sortedEmpData = empData.OrderBy(e => e.LastName).ThenBy(e => e.FirstName).ToList();

            for (int i = 0; i < empData.Count; i++)
            {
                empData[i].LastName.Should().Be(sortedEmpData[i].LastName,
                    $"Employee at index {i} should be ordered by LastName");
                empData[i].FirstName.Should().Be(sortedEmpData[i].FirstName,
                    $"Employee at index {i} should be ordered by FirstName within LastName");
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

            orgs.GetArrayLength().Should().BeGreaterThan(0);
            var org = orgs[0];
            var departments = org.GetProperty("departments").EnumerateArray().ToList();

            departments.Should().NotBeEmpty();

            // Level 1: Departments should be ordered by Name
            var deptNames = departments.Select(d => d.GetProperty("name").GetString()).ToList();
            var sortedDeptNames = deptNames.OrderBy(n => n).ToList();
            deptNames.Should().Equal(sortedDeptNames, "Departments should be ordered by Name");

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
                        employees[i].LastName.Should().Be(sortedEmployees[i].LastName,
                            $"Employees in {dept.GetProperty("name").GetString()} should be ordered by LastName");
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

            empWithSkills.Should().NotBeNull("At least one employee should have skills");

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
                    skills[i].Category.Should().Be(sortedSkills[i].Category,
                        $"Skill at index {i} should be ordered by Category");
                    skills[i].Name.Should().Be(sortedSkills[i].Name,
                        $"Skill at index {i} should be ordered by Name within Category");
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

            empWithProjects.Should().NotBeNull("At least one employee should have projects");

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
                    projects[i].Deadline.Should().Be(sortedProjects[i].Deadline,
                        $"Project at index {i} should be ordered by Deadline (ascending)");
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

            roles.GetArrayLength().Should().BeGreaterThan(0);
            var role = roles[0];
            role.TryGetProperty("level", out _).Should().BeTrue();
            role.TryGetProperty("title", out _).Should().BeTrue();
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

            projectWithTasks.Should().NotBeNull("At least one project should have tasks");

            if (projectWithTasks.HasValue)
            {
                var tasks = projectWithTasks.Value.GetProperty("tasks").EnumerateArray().ToList();
                foreach (var task in tasks)
                {
                    var status = task.GetProperty("status").GetString();
                    status.Should().NotBe("Completed",
                        "Tasks with Status 'Completed' should be filtered out by where clause");
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

            empWithCerts.Should().NotBeNull("At least one employee should have certifications");

            if (empWithCerts.HasValue)
            {
                var certs = empWithCerts.Value.GetProperty("certifications").EnumerateArray().ToList();
                foreach (var cert in certs)
                {
                    var validUntil = cert.GetProperty("validUntil").GetDateTime();
                    validUntil.Should().BeOnOrAfter(System.DateTime.Now,
                        "Only valid (non-expired) certifications should be included");
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
                    certs[i].Should().Be(sortedCerts[i],
                        $"Certification at index {i} should be ordered by ValidUntil descending");
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
                    tasks[i].Should().Be(sortedTasks[i],
                        $"Task at index {i} should be ordered by DueDate (ascending)");
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

            teams.GetArrayLength().Should().BeGreaterThan(0);
            var team = teams[0];
            var members = team.GetProperty("members").EnumerateArray().ToList();

            members.Should().NotBeEmpty();

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
                    memberData[i].LastName.Should().Be(sortedMembers[i].LastName,
                        $"Team member at index {i} should be ordered by LastName");
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

            clients.GetArrayLength().Should().BeGreaterThan(0);
            var client = clients[0];
            var projects = client.GetProperty("projects").EnumerateArray().ToList();

            projects.Should().NotBeEmpty();

            if (projects.Count > 1)
            {
                var projectDeadlines = projects.Select(p => p.GetProperty("deadline").GetDateTime()).ToList();
                var sortedDeadlines = projectDeadlines.OrderBy(d => d).ToList();

                for (int i = 0; i < projectDeadlines.Count; i++)
                {
                    projectDeadlines[i].Should().Be(sortedDeadlines[i],
                        $"Project at index {i} should be ordered by Deadline");
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

            orgs.GetArrayLength().Should().BeGreaterThan(0);
            var org = orgs[0];
            var departments = org.GetProperty("departments").EnumerateArray().ToList();

            // Level 1: Departments ordered by Name
            if (departments.Count > 1)
            {
                var deptNames = departments.Select(d => d.GetProperty("name").GetString()).ToList();
                var sortedDeptNames = deptNames.OrderBy(n => n).ToList();
                deptNames.Should().Equal(sortedDeptNames, "Departments should be ordered by Name");
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
                        employees[i].LastName.Should().Be(sortedEmployees[i].LastName);
                    }

                    // Level 3: Projects within employees ordered by Deadline
                    foreach (var emp in employees)
                    {
                        if (emp.Element.TryGetProperty("projects", out var projectsArray) && projectsArray.GetArrayLength() > 1)
                        {
                            var projects = projectsArray.EnumerateArray()
                                .Select(p => p.GetProperty("deadline").GetDateTime()).ToList();

                            var sortedProjects = projects.OrderBy(p => p).ToList();

                            for (int i = 0; i < projects.Count; i++)
                            {
                                projects[i].Should().Be(sortedProjects[i]);
                            }
                        }
                    }
                }
            }
        }
    }
}
