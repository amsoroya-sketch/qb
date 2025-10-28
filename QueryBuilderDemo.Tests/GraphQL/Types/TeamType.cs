using HotChocolate.Data;
using HotChocolate.Types;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.Tests.GraphQL.Types;

/// <summary>
/// GraphQL type extension for Team that adds server-side sorting/filtering for collections
/// </summary>
public class TeamType : ObjectType<Team>
{
    protected override void Configure(IObjectTypeDescriptor<Team> descriptor)
    {
        descriptor.Name("Team");

        // Add sortable/filterable to existing Members navigation property
        descriptor
            .Field(f => f.Members)
            .UseFiltering()
            .UseSorting();
    }
}
