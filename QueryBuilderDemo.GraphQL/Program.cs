using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.GraphQL.GraphQL;
using QueryBuilderDemo.Tests.Data;

var builder = WebApplication.CreateBuilder(args);

// Add EF Core DbContext (using SQLite in-memory for demo/testing)
// In production, this would be configured via appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("DataSource=:memory:"));

// Add GraphQL server with Hot Chocolate
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddProjections()   // Enable field projections - solves EF Core ordering issue!
    .AddFiltering()     // Enable WHERE clause filtering
    .AddSorting();      // Enable ORDER BY sorting

// Add API explorer for GraphQL schema introspection
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Banana Cake Pop (GraphQL IDE) is included with Hot Chocolate
    // Navigate to /graphql to access it
}

// Map the GraphQL endpoint
app.MapGraphQL();

app.Run();
