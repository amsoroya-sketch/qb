using HotChocolate.Data;
using HotChocolate.Types;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.Tests.GraphQL.Types;

/// <summary>
/// GraphQL type extension for Organisation that adds server-side sorting/filtering for collections
/// </summary>
public class OrganisationType : ObjectType<Organisation>
{
    protected override void Configure(IObjectTypeDescriptor<Organisation> descriptor)
    {
        descriptor.Name("Organisation");

        // Add sortable/filterable to existing Departments navigation property
        descriptor
            .Field(f => f.Departments)
            .UseFiltering()
            .UseSorting();
    }
}
