using HotChocolate;
using HotChocolate.Execution;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using QueryBuilderDemo.Tests.GraphQL;
using QueryBuilderDemo.Tests.Data;
using System.Threading.Tasks;

namespace QueryBuilderDemo.Tests.Helpers;

/// <summary>
/// Helper class for executing GraphQL queries in tests programmatically (not via HTTP).
/// This allows us to test that GraphQL with projections solves the EF Core ordering issue.
/// </summary>
public static class GraphQLTestHelper
{
    /// <summary>
    /// Executes a GraphQL query string against the provided DbContext using Hot Chocolate's execution engine.
    /// Returns the raw execution result which can be inspected in tests.
    /// </summary>
    /// <param name="context">The ApplicationDbContext to query against</param>
    /// <param name="queryString">The GraphQL query string to execute</param>
    /// <returns>The GraphQL execution result</returns>
    public static async Task<IExecutionResult> ExecuteQueryAsync(
        ApplicationDbContext context,
        string queryString)
    {
        // Build a service collection with the DbContext and GraphQL schema
        var services = new ServiceCollection();

        // Register the DbContext instance (tests create and seed their own context)
        services.AddSingleton(context);

        // Configure GraphQL with the same settings as the main application
        services
            .AddGraphQLServer()
            .AddQueryType<Query>()
            .AddProjections()   // Enable projections - this solves the ordering issue!
            .AddFiltering()
            .AddSorting()
            .ModifyPagingOptions(opt =>
            {
                opt.MaxPageSize = 500;
                opt.DefaultPageSize = 50;
                opt.IncludeTotalCount = true;
            });

        // Build the service provider
        var serviceProvider = services.BuildServiceProvider();

        // Get the request executor
        var requestExecutor = await serviceProvider
            .GetRequiredService<IRequestExecutorResolver>()
            .GetRequestExecutorAsync();

        // Execute the query
        var result = await requestExecutor.ExecuteAsync(queryString);

        return result;
    }

    /// <summary>
    /// Helper to execute a query and return the data as JSON string.
    /// Useful for simple test assertions.
    /// </summary>
    public static async Task<string?> ExecuteAndGetDataAsJsonAsync(
        ApplicationDbContext context,
        string queryString)
    {
        var result = await ExecuteQueryAsync(context, queryString);

        return result.ToJson();
    }
}
