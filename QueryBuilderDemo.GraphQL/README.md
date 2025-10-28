# GraphQL API - QueryBuilder Demo

A GraphQL API demonstrating advanced query capabilities with flattened data, pagination, sorting, and filtering.

## Features

✅ **Flattened Data Queries** - Denormalized reporting via `BuildFlattenedQuery<T>()`
✅ **Cursor-Based Pagination** - Efficient navigation through large datasets
✅ **Offset-Based Pagination** - Traditional skip/take for flattened queries
✅ **Recursion Prevention** - Max execution depth of 2 prevents infinite loops
✅ **Flexible Filtering** - Full HotChocolate filtering support
✅ **Dynamic Sorting** - Sort by any field in any direction

## Running the API

```bash
cd QueryBuilderDemo.GraphQL
dotnet run
```

Navigate to: **http://localhost:5000/graphql**

You'll see the Banana Cake Pop GraphQL IDE where you can explore the schema and run queries.

## Sample Data

The API auto-seeds sample data on startup:
- 2 Organisations (TechCorp Inc, BuildRight Ltd)
- 6 Departments
- 6 Employees
- 4 Projects
- Multiple Skills, Certifications, Tasks, Teams

## Query Examples

### 1. Standard Queries with Pagination

#### Get Employees with Pagination (Cursor-Based)
```graphql
{
  employees(first: 10) {
    nodes {
      id
      firstName
      lastName
      email
      department {
        name
        organisation {
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

#### Get Organisations with Nested Data
```graphql
{
  organisations(first: 5) {
    nodes {
      name
      industry
      departments {
        name
        budget
        employees {
          firstName
          lastName
          email
        }
      }
    }
    totalCount
  }
}
```

### 2. Flattened Data Queries

#### Flatten Organisations → Departments → Employees
Returns one row per employee with all parent data:

```graphql
{
  organisationsFlattened(skip: 0, take: 50) {
    # Returns dynamic objects with flattened fields
    # Fields: Id, Name, Industry, Departments_Name,
    #         Departments_Employees_FirstName, etc.
  }
}
```

**Custom Fields:**
```graphql
{
  organisationsFlattened(
    fields: [
      "Id"
      "Name"
      "Departments.Name"
      "Departments.Budget"
      "Departments.Employees.FirstName"
      "Departments.Employees.Email"
    ]
    skip: 0
    take: 100
  )
}
```

#### Flatten Employees with Projects and Skills
```graphql
{
  employeesFlattened(
    fields: [
      "Id"
      "FirstName"
      "LastName"
      "Department.Name"
      "Projects.Title"
      "Skills.Name"
    ]
    skip: 0
    take: 50
  )
}
```

#### Flatten Projects with Tasks and Team Members
```graphql
{
  projectsFlattened(
    fields: [
      "Title"
      "Deadline"
      "Client.Name"
      "Tasks.Title"
      "Tasks.Status"
      "TeamMembers.FirstName"
      "TeamMembers.Department.Name"
    ]
    take: 100
  )
}
```

### 3. Filtering

#### Complex Filtering
```graphql
{
  employees(
    where: {
      and: [
        { department: { name: { contains: "Engineering" } } }
        { role: { level: { eq: "Senior" } } }
      ]
    }
    first: 20
  ) {
    nodes {
      firstName
      lastName
      department {
        name
      }
      role {
        title
        level
      }
    }
  }
}
```

#### Filter by Nested Properties
```graphql
{
  organisations(
    where: {
      departments: {
        some: {
          budget: { gte: 1000000 }
        }
      }
    }
  ) {
    nodes {
      name
      departments {
        name
        budget
      }
    }
  }
}
```

### 4. Sorting

#### Sort Employees
```graphql
{
  employees(
    order: [
      { lastName: ASC }
      { firstName: ASC }
    ]
    first: 10
  ) {
    nodes {
      firstName
      lastName
      email
    }
  }
}
```

#### Sort Projects
```graphql
{
  projects(
    order: [
      { deadline: ASC }
      { budget: DESC }
    ]
    first: 10
  ) {
    nodes {
      title
      deadline
      budget
      client {
        name
      }
    }
  }
}
```

### 5. Pagination Patterns

#### Cursor-Based (Forward)
```graphql
{
  employees(first: 10, after: "cursor_value") {
    nodes {
      firstName
      lastName
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

#### Cursor-Based (Backward)
```graphql
{
  employees(last: 10, before: "cursor_value") {
    nodes {
      firstName
      lastName
    }
    pageInfo {
      hasPreviousPage
      startCursor
    }
  }
}
```

#### Offset-Based (Flattened Queries)
```graphql
{
  employeesFlattened(skip: 20, take: 10) {
    # Page 3 (records 20-30)
  }
}
```

### 6. Recursion Prevention

The API limits query depth to 2 levels to prevent circular reference issues:

```graphql
{
  organisations {
    nodes {
      name
      departments {              # Level 1
        name
        employees {              # Level 2
          firstName
          # Cannot go deeper - max depth reached
        }
      }
    }
  }
}
```

This prevents infinite loops when querying circular relationships (e.g., Employee → Department → Employees → Department → ...).

## Architecture

### Standard Resolvers (`Query.cs`)
- Return typed `IQueryable<T>` for all entities
- Support HotChocolate's `UseProjection`, `UseFiltering`, `UseSorting`
- Use cursor-based pagination via `UsePaging`
- All operations happen at the database level (translated to SQL)

### Flattened Resolvers (`FlattenedQuery.cs`)
- Use `BuildFlattenedQuery<T>()` for denormalization
- Return `IQueryable<object>` with dynamic properties
- Support custom field selection
- Use offset-based pagination (skip/take)
- Ideal for reporting and analytics

### Key Technologies
- **HotChocolate 15.x** - GraphQL server
- **Entity Framework Core** - Data access with SQLite
- **System.Linq.Dynamic.Core** - Dynamic LINQ for flattened queries
- **Custom QueryBuilder** - Flattened query implementation

## Project Structure

```
QueryBuilderDemo.GraphQL/
├── GraphQL/
│   ├── Query.cs              # Standard typed queries
│   └── FlattenedQuery.cs     # Flattened/denormalized queries
├── Utils/
│   └── QueryBuilderExtensions.cs  # BuildFlattenedQuery implementation
├── Program.cs                # GraphQL server configuration
└── README.md

QueryBuilderDemo.Tests/
├── Models/                   # Entity models
├── Data/
│   ├── ApplicationDbContext.cs    # EF Core DbContext
│   └── SampleDataSeeder.cs        # Sample data
├── GraphQL/
│   └── Query.cs              # Query type for tests
└── Helpers/                  # Test helpers
```

## Configuration

### GraphQL Server (Program.cs)

```csharp
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddTypeExtension<FlattenedQuery>()
    .AddProjections()           // Enable field selection
    .AddFiltering()             // Enable WHERE clauses
    .AddSorting()               // Enable ORDER BY
    .ModifyPagingOptions(opt => {
        opt.MaxPageSize = 500;
        opt.DefaultPageSize = 50;
        opt.IncludeTotalCount = true;
    })
    .AddMaxExecutionDepthRule(2)  // Prevent deep recursion
    .ModifyRequestOptions(opt =>
        opt.IncludeExceptionDetails = builder.Environment.IsDevelopment());
```

## Performance Notes

- **Flattened queries** return denormalized data ideal for reporting/analytics
- **Cursor pagination** is more efficient for large datasets
- **Offset pagination** is simpler but can be slower on large tables
- **Max execution depth** prevents circular reference infinite loops
- All operations are translated to SQL and executed at the database level

## Available Flattened Queries

1. `organisationsFlattened` - Organisations with departments and employees
2. `employeesFlattened` - Employees with all related entities
3. `projectsFlattened` - Projects with tasks and team members
4. `clientsFlattened` - Clients with projects, invoices, and payments
5. `teamsFlattened` - Teams with members and departments
