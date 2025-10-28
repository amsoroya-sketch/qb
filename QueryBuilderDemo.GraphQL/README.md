# GraphQL API - QueryBuilder Demo

A GraphQL API demonstrating query capabilities with pagination, sorting, and filtering.

## Features

✅ **Cursor-Based Pagination** - Efficient navigation through large datasets
✅ **Filtering** - Full HotChocolate filtering support
✅ **Sorting** - Sort by any field in any direction
✅ **Projection** - Select only the fields you need
✅ **Recursion Prevention** - Max execution depth of 2 prevents infinite loops

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

### 1. Basic Queries

#### Get All Employees
```graphql
{
  employees {
    nodes {
      id
      firstName
      lastName
      email
    }
  }
}
```

#### Get Employees with Department
```graphql
{
  employees {
    nodes {
      firstName
      lastName
      department {
        name
        budget
      }
    }
  }
}
```

### 2. Pagination

#### Cursor-Based Pagination (Forward)
```graphql
{
  employees(first: 10) {
    nodes {
      id
      firstName
      lastName
      email
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

#### Next Page
```graphql
{
  employees(first: 10, after: "cursor_from_previous_query") {
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

#### Backward Pagination
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

### 3. Filtering

#### Filter by Department
```graphql
{
  employees(
    where: {
      department: {
        name: { contains: "Engineering" }
      }
    }
  ) {
    nodes {
      firstName
      lastName
      department {
        name
      }
    }
  }
}
```

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

#### Filter Organisations by Department Budget
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
      industry
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

#### Sort Projects by Deadline
```graphql
{
  projects(
    order: [
      { deadline: ASC }
      { budget: DESC }
    ]
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

### 5. Nested Data

#### Organisations with Departments and Employees
```graphql
{
  organisations {
    nodes {
      name
      industry
      departments {
        name
        budget
        head
        employees {
          firstName
          lastName
          email
          role {
            title
            level
          }
        }
      }
    }
  }
}
```

#### Employees with All Relations
```graphql
{
  employees(first: 5) {
    nodes {
      firstName
      lastName
      email
      department {
        name
        organisation {
          name
          industry
        }
      }
      role {
        title
        level
        description
      }
      projects {
        title
        deadline
      }
      skills {
        name
        proficiency
        category
      }
    }
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

### 7. Combining Features

```graphql
{
  employees(
    where: {
      department: {
        budget: { gte: 500000 }
      }
    }
    order: { lastName: ASC }
    first: 20
  ) {
    nodes {
      firstName
      lastName
      email
      department {
        name
        budget
      }
      role {
        title
        level
      }
      projects {
        title
        deadline
        status
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

## Available Queries

### Entities
- `organisations` - All organisations
- `departments` - All departments
- `employees` - All employees
- `projects` - All projects
- `clients` - All clients
- `roles` - All roles
- `skills` - All skills
- `teams` - All teams
- `certifications` - All certifications
- `tasks` - All tasks
- `meetings` - All meetings
- `schedules` - All schedules
- `locations` - All locations
- `invoices` - All invoices
- `payments` - All payments

All queries support:
- Filtering via `where` parameter
- Sorting via `order` parameter
- Pagination via `first`/`after` or `last`/`before`
- Field selection (only request the fields you need)

## Architecture

### GraphQL Server
- **HotChocolate 15.x** - GraphQL server framework
- **Entity Framework Core** - ORM with SQLite in-memory database
- **Cursor-based pagination** - Efficient for large datasets
- **Max execution depth: 2** - Prevents infinite recursion

### Query Resolution
All queries:
- Return typed `IQueryable<T>`
- Support `UseProjection` for field selection
- Support `UseFiltering` for WHERE clauses
- Support `UseSorting` for ORDER BY
- Use `UsePaging` for cursor-based pagination
- Execute at the database level (translated to SQL)

## Project Structure

```
QueryBuilderDemo.GraphQL/
├── GraphQL/
│   └── Query.cs              # All GraphQL queries
├── Program.cs                # Server configuration
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

- **Cursor pagination** is more efficient than offset pagination for large datasets
- **Projections** ensure only requested fields are fetched from the database
- **Max execution depth** prevents circular reference infinite loops
- All operations are translated to SQL and executed at the database level
- Use `totalCount` sparingly as it requires an additional COUNT query
