using HotChocolate;
using HotChocolate.Types;
using PbsApi.Utils;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Models;
using System.Collections.Generic;
using System.Linq;

namespace QueryBuilderDemo.GraphQL.GraphQL;

/// <summary>
/// GraphQL resolvers for flattened queries using BuildFlattenedQuery.
/// Returns flattened, denormalized data suitable for reporting and analytics.
/// </summary>
[ExtendObjectType(typeof(Query))]
public class FlattenedQuery
{
    /// <summary>
    /// Get flattened organisation data including departments and employees.
    /// Returns one row per employee with all parent data included.
    /// </summary>
    /// <param name="context">Database context</param>
    /// <param name="fields">Fields to include in the flattened result (e.g., ["Id", "Name", "Departments.Name", "Departments.Employees.FirstName"])</param>
    /// <param name="skip">Number of records to skip (for pagination)</param>
    /// <param name="take">Number of records to take (for pagination)</param>
    /// <returns>Flattened query result</returns>
    public IQueryable<object> GetOrganisationsFlattened(
        [Service] ApplicationDbContext context,
        List<string>? fields = null,
        int skip = 0,
        int take = 100)
    {
        var selectFields = fields != null && fields.Any()
            ? new HashSet<string>(fields)
            : new HashSet<string> {
                "Id",
                "Name",
                "Industry",
                "Departments.Name",
                "Departments.Employees.FirstName",
                "Departments.Employees.LastName",
                "Departments.Employees.Email"
            };

        var query = context.Organisations.BuildFlattenedQuery<Organisation>(selectFields);

        return query.Cast<object>().Skip(skip).Take(take);
    }

    /// <summary>
    /// Get flattened employee data including all related entities.
    /// Returns comprehensive employee information with projects, skills, etc.
    /// </summary>
    public IQueryable<object> GetEmployeesFlattened(
        [Service] ApplicationDbContext context,
        List<string>? fields = null,
        int skip = 0,
        int take = 100)
    {
        var selectFields = fields != null && fields.Any()
            ? new HashSet<string>(fields)
            : new HashSet<string> {
                "Id",
                "FirstName",
                "LastName",
                "Email",
                "Department.Name",
                "Role.Title",
                "Projects.Title",
                "Skills.Name"
            };

        var query = context.Employees.BuildFlattenedQuery<Employee>(selectFields);

        return query.Cast<object>().Skip(skip).Take(take);
    }

    /// <summary>
    /// Get flattened project data including tasks and team members.
    /// Returns one row per task with project and employee information.
    /// </summary>
    public IQueryable<object> GetProjectsFlattened(
        [Service] ApplicationDbContext context,
        List<string>? fields = null,
        int skip = 0,
        int take = 100)
    {
        var selectFields = fields != null && fields.Any()
            ? new HashSet<string>(fields)
            : new HashSet<string> {
                "Id",
                "Title",
                "Deadline",
                "Budget",
                "Client.Name",
                "Tasks.Title",
                "Tasks.Status",
                "TeamMembers.FirstName",
                "TeamMembers.LastName"
            };

        var query = context.Projects.BuildFlattenedQuery<Project>(selectFields);

        return query.Cast<object>().Skip(skip).Take(take);
    }

    /// <summary>
    /// Get flattened client data including projects, invoices, and payments.
    /// Returns comprehensive client financial information.
    /// </summary>
    public IQueryable<object> GetClientsFlattened(
        [Service] ApplicationDbContext context,
        List<string>? fields = null,
        int skip = 0,
        int take = 100)
    {
        var selectFields = fields != null && fields.Any()
            ? new HashSet<string>(fields)
            : new HashSet<string> {
                "Id",
                "Name",
                "Industry",
                "Location.City",
                "Location.Country",
                "Projects.Title",
                "Projects.Budget",
                "Invoices.Amount",
                "Invoices.Payments.Amount"
            };

        var query = context.Clients.BuildFlattenedQuery<Client>(selectFields);

        return query.Cast<object>().Skip(skip).Take(take);
    }

    /// <summary>
    /// Get flattened team data including members and their departments.
    /// Returns one row per team member with team and department information.
    /// </summary>
    public IQueryable<object> GetTeamsFlattened(
        [Service] ApplicationDbContext context,
        List<string>? fields = null,
        int skip = 0,
        int take = 100)
    {
        var selectFields = fields != null && fields.Any()
            ? new HashSet<string>(fields)
            : new HashSet<string> {
                "Id",
                "Name",
                "Purpose",
                "Members.FirstName",
                "Members.LastName",
                "Members.Department.Name",
                "Members.Role.Title"
            };

        var query = context.Teams.BuildFlattenedQuery<Team>(selectFields);

        return query.Cast<object>().Skip(skip).Take(take);
    }
}
