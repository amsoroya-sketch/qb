using HotChocolate.Data;
using HotChocolate.Types;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.Tests.GraphQL.Types;

/// <summary>
/// GraphQL type extension for Employee that adds server-side sorting/filtering for collections
/// </summary>
public class EmployeeType : ObjectType<Employee>
{
    protected override void Configure(IObjectTypeDescriptor<Employee> descriptor)
    {
        descriptor.Name("Employee");

        // Add sortable/filterable to existing Projects navigation property
        descriptor
            .Field(f => f.Projects)
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable to existing Skills navigation property
        descriptor
            .Field(f => f.Skills)
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable to existing Certifications navigation property
        descriptor
            .Field(f => f.Certifications)
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable to existing Tasks navigation property
        descriptor
            .Field(f => f.Tasks)
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable to existing Teams navigation property
        descriptor
            .Field(f => f.Teams)
            .UseFiltering()
            .UseSorting();
    }
}
