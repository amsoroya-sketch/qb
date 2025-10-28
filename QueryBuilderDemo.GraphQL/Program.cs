using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.GraphQL.GraphQL;
using QueryBuilderDemo.GraphQL.GraphQL.Types;
using QueryBuilderDemo.Tests.Data;
using HotChocolate.Execution.Configuration;
using HotChocolate.Data;

var builder = WebApplication.CreateBuilder(args);

// Add EF Core DbContext (using SQLite in-memory for demo/testing)
// In production, this would be configured via appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("DataSource=:memory:"));

// Add GraphQL server with Hot Chocolate
builder.Services
    .AddGraphQLServer()
    // Register main Query type
    .AddQueryType<Query>()
    // Register custom types with sortable/filterable collections
    .AddType<EmployeeType>()
    .AddType<DepartmentType>()
    .AddType<OrganisationType>()
    .AddType<TeamType>()
    .AddType<ClientType>()
    .AddType<ProjectType>()
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
    .AddMaxExecutionDepthRule(2)
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
