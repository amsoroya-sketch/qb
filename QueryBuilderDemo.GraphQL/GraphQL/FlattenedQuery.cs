using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Models;
using QueryBuilderDemo.GraphQL.GraphQL.Models;

namespace QueryBuilderDemo.GraphQL.GraphQL;

/// <summary>
/// Flattened query endpoints that return data in a denormalized format
/// All queries support filtering, sorting, and pagination at the database level
/// </summary>
[ExtendObjectType(typeof(Query))]
public class FlattenedQuery
{
    /// <summary>
    /// Get flattened organisation-department data with filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<OrganisationDepartmentFlat> GetOrganisationDepartmentsFlat([Service] ApplicationDbContext context)
    {
        return context.Departments
            .Select(d => new OrganisationDepartmentFlat
            {
                // Organisation fields
                OrganisationId = d.Organisation!.Id,
                OrganisationName = d.Organisation.Name,
                OrganisationIndustry = d.Organisation.Industry,
                OrganisationFoundYear = d.Organisation.FoundYear,

                // Department fields
                DepartmentId = d.Id,
                DepartmentName = d.Name,
                DepartmentBudget = d.Budget,
                DepartmentHead = d.Head
            });
    }

    /// <summary>
    /// Get flattened organisation-department-employee data with filtering, sorting, and pagination
    /// This is the most comprehensive flattened view showing 3-level hierarchy as flat records
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<OrganisationDepartmentEmployeeFlat> GetOrganisationDepartmentEmployeesFlat([Service] ApplicationDbContext context)
    {
        return context.Employees
            .Select(e => new OrganisationDepartmentEmployeeFlat
            {
                // Organisation fields
                OrganisationId = e.Department!.Organisation!.Id,
                OrganisationName = e.Department.Organisation.Name,
                OrganisationIndustry = e.Department.Organisation.Industry,
                OrganisationFoundYear = e.Department.Organisation.FoundYear,

                // Department fields
                DepartmentId = e.Department.Id,
                DepartmentName = e.Department.Name,
                DepartmentBudget = e.Department.Budget,
                DepartmentHead = e.Department.Head,

                // Employee fields
                EmployeeId = e.Id,
                EmployeeFirstName = e.FirstName,
                EmployeeLastName = e.LastName,
                EmployeeEmail = e.Email,

                // Role fields
                RoleId = e.Role!.Id,
                RoleTitle = e.Role.Title,
                RoleLevel = e.Role.Level
            });
    }

    /// <summary>
    /// Get flattened department-employee data with filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<DepartmentEmployeeFlat> GetDepartmentEmployeesFlat([Service] ApplicationDbContext context)
    {
        return context.Employees
            .Select(e => new DepartmentEmployeeFlat
            {
                // Department fields
                DepartmentId = e.Department!.Id,
                DepartmentName = e.Department.Name,
                DepartmentBudget = e.Department.Budget,
                DepartmentHead = e.Department.Head,

                // Employee fields
                EmployeeId = e.Id,
                EmployeeFirstName = e.FirstName,
                EmployeeLastName = e.LastName,
                EmployeeEmail = e.Email,

                // Role fields
                RoleId = e.Role!.Id,
                RoleTitle = e.Role.Title,
                RoleLevel = e.Role.Level
            });
    }

    /// <summary>
    /// Get flattened employee-project data (many-to-many) with filtering, sorting, and pagination
    /// Each employee-project assignment creates one row
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<EmployeeProjectFlat> GetEmployeeProjectsFlat([Service] ApplicationDbContext context)
    {
        return context.Employees
            .SelectMany(e => e.Projects, (employee, project) => new EmployeeProjectFlat
            {
                // Employee fields
                EmployeeId = employee.Id,
                EmployeeFirstName = employee.FirstName,
                EmployeeLastName = employee.LastName,
                EmployeeEmail = employee.Email,

                // Department fields
                DepartmentId = employee.Department!.Id,
                DepartmentName = employee.Department.Name,

                // Role fields
                RoleId = employee.Role!.Id,
                RoleTitle = employee.Role.Title,
                RoleLevel = employee.Role.Level,

                // Project fields
                ProjectId = project.Id,
                ProjectTitle = project.Title,
                ProjectDeadline = project.Deadline,
                ProjectBudget = project.Budget,

                // Client fields
                ClientId = project.Client!.Id,
                ClientName = project.Client.Name
            });
    }

    /// <summary>
    /// Get flattened project-task data with filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<ProjectTaskFlat> GetProjectTasksFlat([Service] ApplicationDbContext context)
    {
        return context.Tasks
            .Select(t => new ProjectTaskFlat
            {
                // Project fields
                ProjectId = t.Project!.Id,
                ProjectTitle = t.Project.Title,
                ProjectDeadline = t.Project.Deadline,
                ProjectBudget = t.Project.Budget,

                // Client fields
                ClientId = t.Project.Client!.Id,
                ClientName = t.Project.Client.Name,
                ClientIndustry = t.Project.Client.Industry,

                // Task fields
                TaskId = t.Id,
                TaskTitle = t.Title,
                TaskStatus = t.Status,
                TaskDueDate = t.DueDate,

                // Assigned Employee fields (nullable)
                AssignedToId = t.AssignedTo != null ? t.AssignedTo.Id : null,
                AssignedToFirstName = t.AssignedTo != null ? t.AssignedTo.FirstName : null,
                AssignedToLastName = t.AssignedTo != null ? t.AssignedTo.LastName : null
            });
    }

    /// <summary>
    /// Get flattened employee-skill data (many-to-many) with filtering, sorting, and pagination
    /// Each employee-skill relationship creates one row
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<EmployeeSkillFlat> GetEmployeeSkillsFlat([Service] ApplicationDbContext context)
    {
        return context.Employees
            .SelectMany(e => e.Skills, (employee, skill) => new EmployeeSkillFlat
            {
                // Employee fields
                EmployeeId = employee.Id,
                EmployeeFirstName = employee.FirstName,
                EmployeeLastName = employee.LastName,
                EmployeeEmail = employee.Email,

                // Department fields
                DepartmentId = employee.Department!.Id,
                DepartmentName = employee.Department.Name,

                // Skill fields
                SkillId = skill.Id,
                SkillName = skill.Name,
                SkillCategory = skill.Category,
                SkillProficiency = skill.Proficiency
            });
    }

    /// <summary>
    /// Get flattened client-project data with filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<ClientProjectFlat> GetClientProjectsFlat([Service] ApplicationDbContext context)
    {
        return context.Projects
            .Select(p => new ClientProjectFlat
            {
                // Client fields
                ClientId = p.Client!.Id,
                ClientName = p.Client.Name,
                ClientIndustry = p.Client.Industry,

                // Location fields
                LocationId = p.Client.Location!.Id,
                LocationCity = p.Client.Location.City,
                LocationState = p.Client.Location.State,
                LocationCountry = p.Client.Location.Country,

                // Project fields
                ProjectId = p.Id,
                ProjectTitle = p.Title,
                ProjectDeadline = p.Deadline,
                ProjectBudget = p.Budget
            });
    }
}
