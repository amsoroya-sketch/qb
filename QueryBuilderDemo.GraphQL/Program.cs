using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.GraphQL.GraphQL;
using QueryBuilderDemo.GraphQL.GraphQL.Types;
using QueryBuilderDemo.GraphQL.Services.QueryBuilder;
using QueryBuilderDemo.GraphQL.Utils;
using QueryBuilderDemo.Tests.Data;
using HotChocolate.Execution.Configuration;
using HotChocolate.Data;

var builder = WebApplication.CreateBuilder(args);

// Add pooled DbContextFactory for singleton services to create temporary contexts
// The factory itself is singleton, but it creates scoped contexts
builder.Services.AddPooledDbContextFactory<ApplicationDbContext>(options =>
    options.UseSqlite("DataSource=graphql_demo.db"));

// Add scoped DbContext for GraphQL resolvers by creating from factory
builder.Services.AddScoped<ApplicationDbContext>(sp =>
{
    var factory = sp.GetRequiredService<IDbContextFactory<ApplicationDbContext>>();
    return factory.CreateDbContext();
});

// Register Query Builder services
builder.Services.AddSingleton<IEntityModelAnalyzer, EntityModelAnalyzer>();
builder.Services.AddScoped<IFieldSpecificationParser, FieldSpecificationParser>();
builder.Services.AddScoped<IDynamicQueryExecutor, DynamicQueryExecutor>();

// Add GraphQL server with Hot Chocolate
builder.Services
    .AddGraphQLServer()
    // Register main Query type (hierarchical)
    .AddQueryType<Query>()
    // Register flattened Query type (denormalized)
    .AddTypeExtension<FlattenedQuery>()
    // Register dynamic query type (flexible field selection)
    .AddTypeExtension<DynamicQuery>()
    // Register custom types with sortable/filterable collections
    .AddType<EmployeeType>()
    .AddType<DepartmentType>()
    .AddType<OrganisationType>()
    .AddType<TeamType>()
    .AddType<ClientType>()
    .AddType<ProjectType>()
    // Add support for dynamic JSON (Dictionary<string, object?>)
    .AddType<AnyType>()
    // Enable projections
    .AddProjections()
    // Enable WHERE clause filtering
    .AddFiltering()
    // Enable ORDER BY sorting
    .AddSorting()
    // Configure pagination settings
    .ModifyPagingOptions(opt =>
    {
        opt.MaxPageSize = 500;
        opt.DefaultPageSize = 50;
        opt.IncludeTotalCount = true;
    })
    // Prevent recursion by limiting query execution depth
    .AddMaxExecutionDepthRule(5)
    // Include exception details in development for debugging
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment());

// Add API explorer for GraphQL schema introspection
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Seed database on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated();
    QueryBuilderDemo.Tests.Data.SampleDataSeeder.SeedTestData(context);

    // Test services in development
    if (app.Environment.IsDevelopment())
    {
        Console.WriteLine("\n");
        EntityModelAnalyzerTester.Test(scope.ServiceProvider);
        FieldSpecificationParserTester.Test(scope.ServiceProvider);
        DynamicQueryExecutorTester.Test(scope.ServiceProvider);
        Console.WriteLine("\n");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Banana Cake Pop (GraphQL IDE) is included with Hot Chocolate
    // Navigate to /graphql to access it
    app.UseHttpsRedirection();
}

// Map the GraphQL endpoint
app.MapGraphQL();

app.Run();
