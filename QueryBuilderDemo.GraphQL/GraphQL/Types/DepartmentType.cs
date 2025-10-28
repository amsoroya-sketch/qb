using HotChocolate.Data;
using HotChocolate.Types;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.GraphQL.GraphQL.Types;

/// <summary>
/// GraphQL type extension for Department that adds server-side sorting/filtering for collections
/// </summary>
public class DepartmentType : ObjectType<Department>
{
    protected override void Configure(IObjectTypeDescriptor<Department> descriptor)
    {
        descriptor.Name("Department");

        // Add sortable/filterable to existing Employees navigation property
        descriptor
            .Field(f => f.Employees)
            .UseFiltering()
            .UseSorting();
    }
}
