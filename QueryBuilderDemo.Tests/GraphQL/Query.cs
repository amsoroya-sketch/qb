using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.Tests.GraphQL;

/// <summary>
/// Root GraphQL Query type exposing all entities with projection, filtering, sorting, and pagination support
/// </summary>
public class Query
{
    /// <summary>
    /// Get all organisations with optional filtering, sorting, and pagination.
    /// Navigation properties (Departments) will be loaded via projections, preserving order.
    /// Supports cursor-based pagination for efficient data fetching.
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10, MaxPageSize = 100)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Organisation> GetOrganisations([Service] ApplicationDbContext context)
        => context.Organisations;

    /// <summary>
    /// Get all departments with optional filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 20, MaxPageSize = 100)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Department> GetDepartments([Service] ApplicationDbContext context)
        => context.Departments;

    /// <summary>
    /// Get all employees with optional filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Employee> GetEmployees([Service] ApplicationDbContext context)
        => context.Employees;

    /// <summary>
    /// Get all projects with optional filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 20, MaxPageSize = 100)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Project> GetProjects([Service] ApplicationDbContext context)
        => context.Projects;

    /// <summary>
    /// Get all skills with optional filtering and sorting
    /// </summary>
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Skill> GetSkills([Service] ApplicationDbContext context)
        => context.Skills;

    /// <summary>
    /// Get all certifications with optional filtering and sorting
    /// </summary>
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Certification> GetCertifications([Service] ApplicationDbContext context)
        => context.Certifications;

    /// <summary>
    /// Get all tasks with optional filtering and sorting
    /// </summary>
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<MdTask> GetTasks([Service] ApplicationDbContext context)
        => context.Tasks;

    /// <summary>
    /// Get all teams with optional filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 20, MaxPageSize = 100)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Team> GetTeams([Service] ApplicationDbContext context)
        => context.Teams;

    /// <summary>
    /// Get all roles with optional filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 20, MaxPageSize = 100)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Role> GetRoles([Service] ApplicationDbContext context)
        => context.Roles;

    /// <summary>
    /// Get all clients with optional filtering, sorting, and pagination
    /// </summary>
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 20, MaxPageSize = 100)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Client> GetClients([Service] ApplicationDbContext context)
        => context.Clients;

    /// <summary>
    /// Get all locations with optional filtering and sorting
    /// </summary>
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<QueryBuilderDemo.Tests.Models.Location> GetLocations([Service] ApplicationDbContext context)
        => context.Locations;

    /// <summary>
    /// Get all meetings with optional filtering and sorting
    /// </summary>
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Meeting> GetMeetings([Service] ApplicationDbContext context)
        => context.Meetings;

    /// <summary>
    /// Get all schedules with optional filtering and sorting
    /// </summary>
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Schedule> GetSchedules([Service] ApplicationDbContext context)
        => context.Schedules;

    /// <summary>
    /// Get all invoices with optional filtering and sorting
    /// </summary>
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Invoice> GetInvoices([Service] ApplicationDbContext context)
        => context.Invoices;

    /// <summary>
    /// Get all payments with optional filtering and sorting
    /// </summary>
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Payment> GetPayments([Service] ApplicationDbContext context)
        => context.Payments;
}
