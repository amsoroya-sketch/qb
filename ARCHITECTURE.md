# GraphQL Query Builder Architecture

## Table of Contents
1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Core Problems Solved](#core-problems-solved)
4. [Technology Stack](#technology-stack)
5. [Component Architecture](#component-architecture)
6. [Data Flow](#data-flow)
7. [Key Design Patterns](#key-design-patterns)
8. [Problem-Solution Mapping](#problem-solution-mapping)
9. [Performance Considerations](#performance-considerations)
10. [Testing Strategy](#testing-strategy)

---

## Overview

This application demonstrates how GraphQL with HotChocolate solves complex querying challenges in .NET applications, particularly the EF Core limitation of not being able to apply ordering to nested collections in a single query.

### The Core Challenge

**Traditional EF Core Limitation:**
```csharp
// ❌ This does NOT work in EF Core
var orgs = context.Organisations
    .Include(o => o.Departments.OrderBy(d => d.Name))  // OrderBy is ignored!
    .Include(o => o.Departments)
        .ThenInclude(d => d.Employees.OrderBy(e => e.LastName))  // Also ignored!
    .ToList();
```

**GraphQL Solution:**
```graphql
# ✅ This WORKS with GraphQL + Projections
{
  organisations {
    name
    departments(order: { name: ASC }) {
      name
      employees(order: [{ lastName: ASC }, { firstName: ASC }]) {
        firstName
        lastName
      }
    }
  }
}
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     GraphQL Client                          │
│                  (Banana Cake Pop, Postman)                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST /graphql
                         │ GraphQL Query
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              HotChocolate Execution Engine                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Query Parsing & Validation                           │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │  Middleware Pipeline (Order Matters!)                 │  │
│  │  1. UsePaging     - Cursor-based pagination           │  │
│  │  2. UseProjection - Smart SELECT optimization         │  │
│  │  3. UseFiltering  - WHERE clause generation           │  │
│  │  4. UseSorting    - ORDER BY generation               │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────▼─────────────────────────────────────┐  │
│  │  ObjectType Extensions                                │  │
│  │  - EmployeeType    - DepartmentType                   │  │
│  │  - OrganisationType - TeamType                        │  │
│  │  - ProjectType     - ClientType                       │  │
│  └─────────────────┬─────────────────────────────────────┘  │
└────────────────────┼─────────────────────────────────────────┘
                     │ IQueryable<T>
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Entity Framework Core                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  IQueryable Translation                               │  │
│  │  - Projections → SELECT optimization                  │  │
│  │  - Filtering   → WHERE clauses                        │  │
│  │  - Sorting     → ORDER BY clauses                     │  │
│  │  - Pagination  → OFFSET/LIMIT                         │  │
│  └─────────────────┬─────────────────────────────────────┘  │
└────────────────────┼─────────────────────────────────────────┘
                     │ SQL Query
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite Database                          │
│   - Organisations                                           │
│   - Departments                                             │
│   - Employees                                               │
│   - Projects, Tasks, Skills, etc.                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Problems Solved

### 1. **EF Core Nested Collection Ordering Limitation**

**Problem:**
Entity Framework Core cannot apply ordering to nested collections loaded via `Include()` or `ThenInclude()`. The `OrderBy()` is silently ignored.

**Traditional Workaround (Inefficient):**
```csharp
// Fetch all data first
var orgs = context.Organisations
    .Include(o => o.Departments)
        .ThenInclude(d => d.Employees)
    .ToList();

// Sort in-memory (inefficient for large datasets)
foreach (var org in orgs)
{
    org.Departments = org.Departments.OrderBy(d => d.Name).ToList();
    foreach (var dept in org.Departments)
    {
        dept.Employees = dept.Employees.OrderBy(e => e.LastName).ToList();
    }
}
```

**GraphQL Solution:**
HotChocolate's projection system translates nested sorting into separate SQL queries, each with proper ORDER BY clauses:

```sql
-- Query 1: Top-level entities
SELECT * FROM Organisations;

-- Query 2: Departments with sorting
SELECT * FROM Departments
WHERE OrganisationId IN (1, 2, 3)
ORDER BY Name ASC;

-- Query 3: Employees with sorting
SELECT * FROM Employees
WHERE DepartmentId IN (4, 5, 6)
ORDER BY LastName ASC, FirstName ASC;
```

### 2. **Over-fetching and Under-fetching**

**Problem:**
REST APIs often return too much data (over-fetching) or require multiple round trips (under-fetching).

**REST Approach:**
```
GET /api/organisations          → Returns ALL fields
GET /api/organisations/1/departments → Returns ALL department fields
GET /api/departments/5/employees → Returns ALL employee fields
```

**GraphQL Solution:**
Client specifies exactly what data it needs:
```graphql
{
  organisations {
    name                    # Only fetch name, not id/industry/foundYear
    departments {
      name                  # Only fetch name, not budget/head
    }
  }
}
```

Generated SQL is optimized:
```sql
SELECT o.Name FROM Organisations o;
SELECT d.Name FROM Departments d WHERE d.OrganisationId IN (...);
```

### 3. **Complex Filtering on Nested Data**

**Problem:**
Filtering nested collections in traditional APIs requires custom endpoints or complex query strings.

**GraphQL Solution:**
```graphql
{
  employees {
    firstName
    certifications(where: { validUntil: { gte: "2025-01-01" } }) {
      name
      validUntil
    }
  }
}
```

Translates to efficient SQL:
```sql
SELECT c.Name, c.ValidUntil
FROM Certifications c
WHERE c.EmployeeId IN (...)
  AND c.ValidUntil >= '2025-01-01';
```

### 4. **N+1 Query Problem**

**Problem:**
Naive implementations can cause N+1 queries (1 query for parent, N queries for children).

**HotChocolate Solution:**
Uses DataLoader pattern and batching to optimize database access:
- Collects all parent IDs
- Fetches children in a single batch query
- Distributes results to appropriate parents

### 5. **API Versioning and Evolution**

**Problem:**
REST APIs require versioning (v1, v2) when fields change.

**GraphQL Solution:**
- Add new fields without breaking existing clients
- Deprecate old fields with `@deprecated` directive
- Clients only request fields they know about

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **GraphQL Server** | HotChocolate 15.x | GraphQL implementation for .NET |
| **ORM** | Entity Framework Core 8.0 | Database access and query translation |
| **Database** | SQLite | Lightweight relational database |
| **Testing** | MSTest | Unit and integration testing |
| **Language** | C# 12 / .NET 8 | Modern .NET platform |

---

## Component Architecture

### 1. **Query Root Type** (`Query.cs`)

The entry point for all GraphQL queries.

```csharp
public class Query
{
    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10, MaxPageSize = 100)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Organisation> GetOrganisations([Service] ApplicationDbContext context)
        => context.Organisations;
}
```

**Middleware Order (Critical!):**
1. `UsePaging` - Must be first to establish pagination boundaries
2. `UseProjection` - Optimizes SELECT statements
3. `UseFiltering` - Adds WHERE clauses
4. `UseSorting` - Adds ORDER BY clauses

### 2. **ObjectType Extensions**

Enable sorting and filtering on nested collections by configuring field resolvers.

**Example: EmployeeType**
```csharp
public class EmployeeType : ObjectType<Employee>
{
    protected override void Configure(IObjectTypeDescriptor<Employee> descriptor)
    {
        descriptor.Name("Employee");

        // Enable sorting/filtering on Projects collection
        descriptor
            .Field(f => f.Projects)
            .UseFiltering()
            .UseSorting();

        // Enable sorting/filtering on Skills collection
        descriptor
            .Field(f => f.Skills)
            .UseFiltering()
            .UseSorting();
    }
}
```

**Why This Works:**
- References existing navigation properties (EF Core handles joins)
- HotChocolate applies sorting/filtering at the SQL level
- Works seamlessly with projections

### 3. **Entity Models**

Standard EF Core entity classes with navigation properties.

```csharp
public class Organisation
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Industry { get; set; }

    // Navigation properties enable GraphQL traversal
    public List<Department> Departments { get; set; } = new();
}

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int OrganisationId { get; set; }

    // Many-to-one
    public Organisation? Organisation { get; set; }
    // One-to-many
    public List<Employee> Employees { get; set; } = new();
}
```

### 4. **DbContext**

Standard EF Core configuration with entity registrations.

```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Organisation> Organisations { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<Employee> Employees { get; set; }
    // ... other entities
}
```

---

## Data Flow

### Example: Fetch Organisations with Sorted Departments

**1. Client Request:**
```graphql
{
  organisations(first: 10) {
    nodes {
      name
      departments(order: { name: ASC }) {
        name
      }
    }
  }
}
```

**2. HotChocolate Processing:**
- **Parsing:** Validates query syntax
- **Execution Planning:** Determines required data
- **Middleware Pipeline:**
  - `UsePaging`: Limits to 10 organisations
  - `UseProjection`: Selects only `name` field
  - `UseFiltering`: (none in this query)
  - `UseSorting`: (applied at top level if specified)

**3. SQL Generation (via EF Core):**
```sql
-- Query 1: Fetch organisations (paged)
SELECT o.Id, o.Name
FROM Organisations o
LIMIT 10;

-- Query 2: Fetch departments (sorted)
SELECT d.Id, d.Name, d.OrganisationId
FROM Departments d
WHERE d.OrganisationId IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
ORDER BY d.Name ASC;
```

**4. Result Assembly:**
HotChocolate assembles the hierarchical response:
```json
{
  "data": {
    "organisations": {
      "nodes": [
        {
          "name": "BuildRight Ltd",
          "departments": [
            { "name": "Construction" },
            { "name": "Project Management" },
            { "name": "Safety & Compliance" }
          ]
        },
        {
          "name": "TechCorp Inc",
          "departments": [
            { "name": "Engineering" },
            { "name": "Finance" },
            { "name": "Human Resources" }
          ]
        }
      ]
    }
  }
}
```

---

## Key Design Patterns

### 1. **Repository Pattern (Implicit)**

EF Core DbContext acts as a repository, exposing `IQueryable<T>` for deferred execution.

```csharp
// Query is not executed until HotChocolate needs the data
public IQueryable<Employee> GetEmployees([Service] ApplicationDbContext context)
    => context.Employees;
```

### 2. **Projection Pattern**

HotChocolate analyzes the GraphQL query and projects only requested fields.

**Query:**
```graphql
{ employees { firstName } }
```

**Generated SQL:**
```sql
SELECT e.FirstName FROM Employees e;  -- Only selects firstName
```

### 3. **Pagination Pattern (Cursor-Based)**

Implements Relay-style cursor pagination:

**Query:**
```graphql
{
  employees(first: 5, after: "cursor_xyz") {
    edges {
      cursor
      node { firstName }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Benefits:**
- Stable pagination (works with dynamic data)
- Efficient for large datasets
- Supports both forward and backward pagination

### 4. **Type Extension Pattern**

Extends entity types with custom behavior without modifying entity classes.

```csharp
public class EmployeeType : ObjectType<Employee>
{
    // Adds GraphQL-specific behavior to Employee entity
}
```

---

## Problem-Solution Mapping

| Problem | Traditional Approach | GraphQL Solution | Benefits |
|---------|---------------------|------------------|----------|
| **Nested Collection Sorting** | In-memory sorting after fetching all data | ObjectType extensions with `UseSorting()` on navigation properties | Database-level sorting, efficient queries |
| **Over-fetching** | Fixed REST endpoints return all fields | Client specifies exact fields needed | Reduced payload size, faster responses |
| **Under-fetching** | Multiple API calls (N+1 requests) | Single GraphQL query fetches all data | Reduced latency, fewer round trips |
| **Complex Filtering** | Custom query parameters or endpoints | GraphQL filtering syntax | Flexible, type-safe queries |
| **API Versioning** | /api/v1, /api/v2 | Field deprecation, additive changes | No breaking changes |
| **Documentation** | Manual API docs (Swagger) | Self-documenting schema | Always up-to-date |
| **Type Safety** | Runtime validation | Compile-time schema validation | Catch errors early |

---

## Performance Considerations

### 1. **Query Cost Analysis**

HotChocolate tracks field costs to prevent expensive queries:

```csharp
.AddMaxExecutionDepthRule(2)  // Prevents deeply nested queries
```

**Default Costs:**
- Simple field: 1 unit
- Collection field: 5 units
- Nested collection: Multiplied cost

**Example:**
```graphql
# Cost = 10 (base) + 50 (10 orgs × 5) + 150 (10 orgs × 3 depts × 5)
{
  organisations(first: 10) {           # 10 results
    departments {                      # 3 per org × 10 = 30 results
      employees { firstName }          # Can explode to thousands
    }
  }
}
```

**Solution:** Require pagination on large collections.

### 2. **Projection Optimization**

Only requested fields are fetched from the database.

**Without Projection:**
```sql
SELECT * FROM Employees;  -- All columns
```

**With Projection:**
```sql
SELECT e.FirstName, e.LastName FROM Employees e;  -- Only needed columns
```

**Savings:** 70-90% reduction in data transfer for typical queries.

### 3. **DataLoader Pattern**

Batches and caches database queries to prevent N+1 problems.

**Example:**
```graphql
{
  employees {              # 1 query: SELECT * FROM Employees
    department {           # 1 query: SELECT * FROM Departments WHERE Id IN (...)
      name                 # NOT N queries!
    }
  }
}
```

### 4. **Caching Strategy**

- **Schema Caching:** Schema is built once at startup
- **Query Plan Caching:** Execution plans are cached
- **Data Caching:** Can integrate with Redis/MemoryCache

---

## Testing Strategy

### 1. **Integration Tests**

Tests execute real GraphQL queries against an in-memory database.

```csharp
[TestMethod]
public async Task BuildQuery_WithDepartmentEmployees_OrdersByEmployeeLastName()
{
    // Arrange
    using var context = TestDbContextFactory.CreateInMemoryContext();
    SampleDataSeeder.SeedTestData(context);

    var query = @"
    {
        departments(first: 10) {
            nodes {
                name
                employees(order: { lastName: ASC }) {
                    firstName
                    lastName
                }
            }
        }
    }";

    // Act
    var result = await GraphQLTestHelper.ExecuteQueryAsync(context, query);

    // Assert
    var jsonResult = result.ToJson();
    var jsonDoc = JsonDocument.Parse(jsonResult);

    // Verify sorting
    var employees = /* extract from JSON */;
    Assert.IsTrue(employees are sorted by lastName);
}
```

**Benefits:**
- Tests actual behavior (not mocks)
- Validates SQL generation
- Catches regression bugs

### 2. **Test Categories**

| Category | Tests | Purpose |
|----------|-------|---------|
| **Nested Sorting** | 5 tests | Verify sorting works at all levels |
| **Filtering** | 3 tests | Validate WHERE clause generation |
| **Pagination** | 2 tests | Ensure cursor pagination works |
| **Complex Hierarchies** | 3 tests | Test multi-level nested queries |

### 3. **Test Helper**

Configures GraphQL execution engine with same settings as production:

```csharp
services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddType<EmployeeType>()
    // ... other types
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .ModifyPagingOptions(opt => {
        opt.MaxPageSize = 500;
        opt.DefaultPageSize = 50;
    });
```

---

## Comparison: REST vs GraphQL

### REST Approach (Traditional)

**Endpoints:**
```
GET /api/organisations
GET /api/organisations/{id}/departments
GET /api/departments/{id}/employees
GET /api/employees/{id}/projects
```

**Client Code:**
```javascript
// 4 separate HTTP requests!
const orgs = await fetch('/api/organisations');
const depts = await fetch(`/api/organisations/${org.id}/departments`);
const emps = await fetch(`/api/departments/${dept.id}/employees`);
const projects = await fetch(`/api/employees/${emp.id}/projects`);

// Client-side sorting (inefficient)
depts.sort((a, b) => a.name.localeCompare(b.name));
emps.sort((a, b) => a.lastName.localeCompare(b.lastName));
```

**Problems:**
- 4 round trips (latency)
- Over-fetching (all fields returned)
- Client-side sorting (slow for large datasets)
- No type safety

### GraphQL Approach

**Single Endpoint:**
```
POST /graphql
```

**Client Code:**
```javascript
const query = `
  {
    organisations {
      name
      departments(order: { name: ASC }) {
        name
        employees(order: { lastName: ASC }) {
          firstName
          lastName
          projects { title }
        }
      }
    }
  }
`;

const data = await fetch('/graphql', {
  method: 'POST',
  body: JSON.stringify({ query })
});
```

**Benefits:**
- 1 round trip
- Exact data needed
- Server-side sorting (fast)
- Type-safe schema

---

## Security Considerations

### 1. **Query Depth Limiting**

```csharp
.AddMaxExecutionDepthRule(2)  // Prevent deeply nested queries
```

Prevents malicious queries:
```graphql
{
  organisations {
    departments {
      employees {
        projects {
          tasks {            # Too deep! Rejected
            assignedTo { ... }
          }
        }
      }
    }
  }
}
```

### 2. **Query Cost Analysis**

```csharp
.AddCostDirective()  // Track and limit query complexity
```

Prevents expensive queries that could DoS the server.

### 3. **Authentication & Authorization**

```csharp
[Authorize]  // Require authentication
public IQueryable<Employee> GetEmployees([Service] ApplicationDbContext context)
    => context.Employees;

[Authorize(Policy = "AdminOnly")]
public IQueryable<Salary> GetSalaries([Service] ApplicationDbContext context)
    => context.Salaries;
```

### 4. **Field-Level Authorization**

```csharp
descriptor
    .Field(f => f.Salary)
    .Authorize("ViewSalary");  // Fine-grained access control
```

---

## Future Enhancements

### 1. **Subscriptions** (Real-time Updates)

```graphql
subscription {
  onEmployeeUpdated {
    id
    firstName
    lastName
  }
}
```

### 2. **Mutations** (Create/Update/Delete)

```graphql
mutation {
  createEmployee(input: {
    firstName: "John"
    lastName: "Doe"
    departmentId: 5
  }) {
    employee {
      id
      firstName
    }
  }
}
```

### 3. **Relay-style Connections**

Full Relay specification compliance for better client integration.

### 4. **Persisted Queries**

Pre-register queries on server to improve performance and security.

---

## Conclusion

This GraphQL architecture demonstrates how modern API design can solve traditional data fetching challenges:

1. **Nested Collection Sorting:** Solved via HotChocolate projections and ObjectType extensions
2. **Over/Under-fetching:** Client specifies exact data needs
3. **Performance:** Database-level optimization via IQueryable translation
4. **Type Safety:** Schema-driven development with compile-time validation
5. **Flexibility:** Single endpoint handles all query variations

The key innovation is HotChocolate's ability to translate GraphQL queries into efficient SQL, particularly for nested collections that EF Core can't handle natively. This enables complex, hierarchical data fetching with sorting and filtering at every level—all executed efficiently at the database layer.

---

**Generated:** 2025-10-28
**Version:** 1.0
**Framework:** .NET 8, HotChocolate 15.x, EF Core 8.0
