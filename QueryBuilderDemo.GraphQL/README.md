# GraphQL API - QueryBuilder Demo

A GraphQL API demonstrating advanced query capabilities with flattened data, pagination, sorting, and recursive inclusion control.

## Features

✅ **Flattened Data Queries** - Using `BuildFlattenedQuery<T>()` for denormalized reporting
✅ **Cursor-Based Pagination** - Efficient navigation through large datasets
✅ **Offset-Based Pagination** - Traditional skip/take for flattened queries
✅ **Recursive Inclusion Control** - Respects `RecursiveIncludeLevel` attribute
✅ **Automatic Sorting** - Honors `DLINQOrderbyAttribute` on collections
✅ **Filtering** - Full `WhereAttribute` support

## Running the API

```bash
cd QueryBuilderDemo.GraphQL
dotnet run
```

Navigate to: **http://localhost:5000/graphql**

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

#### Get Organisations with Filtered Departments
```graphql
{
  organisations(first: 5) {
    nodes {
      name
      industry
      departments(where: { budget: { gte: 1000000 } }) {
        name
        budget
        employees {
          firstName
          lastName
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

### 3. Sorting with DLINQ Attributes

Collections are automatically sorted based on `[DLINQOrderbyAttribute]`:

```graphql
{
  employees(first: 10) {
    nodes {
      firstName
      # Skills automatically sorted by Category, then Name
      skills {
        category
        name
        proficiency
      }
      # Projects automatically sorted by Deadline
      projects {
        title
        deadline
      }
      # Certifications sorted by ValidUntil (descending)
      certifications {
        name
        validUntil
      }
    }
  }
}
```

**Attribute Configuration (in Models):**
```csharp
[DLINQOrderbyAttribute("Category")]
[DLINQOrderbyAttribute("Name")]
public List<Skill> Skills { get; set; } = new();

[DLINQOrderbyAttribute("Deadline")]
public List<Project> Projects { get; set; } = new();

[DLINQOrderbyAttribute("ValidUntil", descending: true)]
public List<Certification> Certifications { get; set; } = new();
```

### 4. Filtering with WhereAttribute

Collections are pre-filtered based on `[WhereAttribute]`:

```graphql
{
  employees {
    nodes {
      firstName
      # Tasks filtered: Status != "Completed"
      tasks {
        title
        status
        dueDate
      }
      # Certifications filtered: ValidUntil >= DateTime.Now
      certifications {
        name
        validUntil
        issuer
      }
    }
  }
}
```

**Attribute Configuration:**
```csharp
[WhereAttribute("Status != \"Completed\"")]
public List<Task> Tasks { get; set; } = new();

[WhereAttribute("ValidUntil >= DateTime.Now")]
public List<Certification> Certifications { get; set; } = new();
```

### 5. Recursive Inclusion Control

The `[RecursiveIncludeLevel(2)]` attribute prevents infinite loops in circular references:

```graphql
{
  organisations {
    nodes {
      name
      departments {
        name
        employees {
          firstName
          # Can navigate 2 levels deep
          department {
            name
            # Stops here - won't load organisation again
          }
        }
      }
    }
  }
}
```

**Attribute Configuration:**
```csharp
[RecursiveIncludeLevel(2)]
public Department? Department { get; set; }
```

### 6. Advanced Filtering & Sorting

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

#### Custom Sorting
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

### 7. Pagination Patterns

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
    # Page 3 (20-30)
  }
}
```

## Architecture

### Standard Resolvers (`Query.cs`)
- Return typed `IQueryable<T>` for all entities
- Support HotChocolate's `UseProjection`, `UseFiltering`, `UseSorting`
- Use cursor-based pagination via `UsePaging`

### Flattened Resolvers (`FlattenedQuery.cs`)
- Use `BuildFlattenedQuery<T>()` from QueryBuilder
- Return `IQueryable<object>` with dynamic properties
- Support custom field selection
- Use offset-based pagination (skip/take)

### Key Technologies
- **HotChocolate 15.x** - GraphQL server
- **Entity Framework Core** - Data access
- **SQLite** - In-memory database
- **Custom QueryBuilder** - Flattened query support

## Testing

Run the test suite:
```bash
cd QueryBuilderDemo.Tests
dotnet test
```

See `HierarchicalOrderingAndFilteringTests.cs` for GraphQL-specific tests.

## Notes

- **Flattened queries** return denormalized data ideal for reporting/analytics
- **Cursor pagination** is more efficient for large datasets
- **Offset pagination** is simpler but can be slower
- **RecursiveIncludeLevel** prevents circular reference issues
- **DLINQ attributes** provide automatic collection ordering
- **Where attributes** apply business rules at the query level
