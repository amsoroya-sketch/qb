using HotChocolate.Data;
using HotChocolate.Types;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.GraphQL.GraphQL.Types;

/// <summary>
/// GraphQL type extension for Client that adds server-side sorting/filtering for collections
/// </summary>
public class ClientType : ObjectType<Client>
{
    protected override void Configure(IObjectTypeDescriptor<Client> descriptor)
    {
        descriptor.Name("Client");

        // Add sortable/filterable to existing Projects navigation property
        descriptor
            .Field(f => f.Projects)
            .UseFiltering()
            .UseSorting();
    }
}
