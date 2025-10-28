using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.GraphQL.GraphQL.Types;

/// <summary>
/// GraphQL type extension for Employee that adds server-side sorting/filtering for collections
/// </summary>
public class EmployeeType : ObjectType<Employee>
{
    protected override void Configure(IObjectTypeDescriptor<Employee> descriptor)
    {
        descriptor.Name("Employee");

        // Add sortable/filterable resolver for Projects collection
        descriptor
            .Field("projects")
            .ResolveWith<EmployeeResolvers>(r => r.GetProjects(default!, default!))
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable resolver for Skills collection
        descriptor
            .Field("skills")
            .ResolveWith<EmployeeResolvers>(r => r.GetSkills(default!, default!))
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable resolver for Certifications collection
        descriptor
            .Field("certifications")
            .ResolveWith<EmployeeResolvers>(r => r.GetCertifications(default!, default!))
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable resolver for Tasks collection
        descriptor
            .Field("tasks")
            .ResolveWith<EmployeeResolvers>(r => r.GetTasks(default!, default!))
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable resolver for Teams collection
        descriptor
            .Field("teams")
            .ResolveWith<EmployeeResolvers>(r => r.GetTeams(default!, default!))
            .UseFiltering()
            .UseSorting();
    }

    private class EmployeeResolvers
    {
        // Many-to-Many: Employee <-> Project
        public IQueryable<Project> GetProjects([Parent] Employee employee, [Service] ApplicationDbContext context)
        {
            return context.Projects.Where(p => p.TeamMembers.Any(e => e.Id == employee.Id));
        }

        // Many-to-Many: Employee <-> Skill
        public IQueryable<Skill> GetSkills([Parent] Employee employee, [Service] ApplicationDbContext context)
        {
            return context.Skills.Where(s => s.Employees.Any(e => e.Id == employee.Id));
        }

        // One-to-Many: Employee -> Certifications
        public IQueryable<Certification> GetCertifications([Parent] Employee employee, [Service] ApplicationDbContext context)
        {
            return context.Certifications.Where(c => c.EmployeeId == employee.Id);
        }

        // One-to-Many: Employee -> Tasks
        public IQueryable<QueryBuilderDemo.Tests.Models.Task> GetTasks([Parent] Employee employee, [Service] ApplicationDbContext context)
        {
            return context.Tasks.Where(t => t.AssignedToId == employee.Id);
        }

        // Many-to-Many: Employee <-> Team
        public IQueryable<Team> GetTeams([Parent] Employee employee, [Service] ApplicationDbContext context)
        {
            return context.Teams.Where(t => t.Members.Any(e => e.Id == employee.Id));
        }
    }
}
