using HotChocolate.Data;
using HotChocolate.Types;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.Tests.GraphQL.Types;

/// <summary>
/// GraphQL type extension for Project that adds server-side sorting/filtering for collections
/// </summary>
public class ProjectType : ObjectType<Project>
{
    protected override void Configure(IObjectTypeDescriptor<Project> descriptor)
    {
        descriptor.Name("Project");

        // Add sortable/filterable to existing Tasks navigation property
        descriptor
            .Field(f => f.Tasks)
            .UseFiltering()
            .UseSorting();

        // Add sortable/filterable to existing TeamMembers navigation property
        descriptor
            .Field(f => f.TeamMembers)
            .UseFiltering()
            .UseSorting();
    }
}
