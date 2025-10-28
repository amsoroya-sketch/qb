# Dynamic Query Builder - Production Architecture Design

**Project:** Intelligent GraphQL Query Builder with Auto-Flattening
**Version:** 1.0.0
**Date:** 2025-10-28

---

## Executive Summary

This document outlines the production-ready architecture for an intelligent query builder that accepts simplified field specifications, automatically expands wildcards, detects entity relationships, and generates optimized GraphQL queries with database-level flattening.

---

## System Architecture

### High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Application                        │
│  (Sends simplified query: ["firstName", "department"])       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              REST API Controller (Optional)                  │
│  POST /api/query/flatten                                     │
│  - Input validation                                          │
│  - Request parsing                                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Query Builder Service (Orchestrator)               │
│  - Coordinates all components                                │
│  - Validates requests                                        │
│  - Builds final query                                        │
└────┬────────────────┬───────────────────┬────────────────────┘
     │                │                   │
     ▼                ▼                   ▼
┌──────────┐  ┌───────────────┐  ┌──────────────────┐
│  Entity  │  │     Field     │  │   GraphQL Query  │
│  Model   │  │ Specification │  │     Builder      │
│ Analyzer │  │    Parser     │  │                  │
└──────────┘  └───────────────┘  └──────────────────┘
     │                │                   │
     └────────────────┴───────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              HotChocolate GraphQL Server                     │
│  - Dynamic Flattening Middleware                             │
│  - Selection Set Interceptor                                 │
│  - Result Transformer                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Entity Framework Core + SQLite                  │
│  - Dynamic LINQ Query Execution                              │
│  - JOIN optimization                                         │
│  - WHERE/ORDER BY/LIMIT in SQL                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Entity Model Analyzer

**Purpose:** Introspect EF Core model to build metadata cache

**Key Responsibilities:**
- Analyze all entity types at startup
- Build property metadata (scalar vs navigation)
- Construct relationship graph
- Cache metadata for fast lookups
- Validate field paths

**Public API:**
```csharp
public interface IEntityModelAnalyzer
{
    EntityMetadata GetEntityMetadata(string entityName);
    bool EntityExists(string entityName);
    bool IsValidFieldPath(string entityName, string fieldPath);
    IReadOnlyList<string> GetAllEntityNames();
    RelationshipInfo GetRelationship(string sourceEntity, string targetEntity);
}
```

**Data Structures:**
```csharp
public class EntityMetadata
{
    public string Name { get; init; }
    public Type ClrType { get; init; }
    public IReadOnlyList<PropertyMetadata> ScalarProperties { get; init; }
    public IReadOnlyList<NavigationPropertyMetadata> NavigationProperties { get; init; }
    public IReadOnlyDictionary<string, PropertyMetadata> PropertyLookup { get; init; }
}

public class PropertyMetadata
{
    public string Name { get; init; }
    public Type PropertyType { get; init; }
    public bool IsNullable { get; init; }
    public bool IsPrimaryKey { get; init; }
}

public class NavigationPropertyMetadata : PropertyMetadata
{
    public string TargetEntityName { get; init; }
    public NavigationType Type { get; init; } // OneToMany, ManyToOne, ManyToMany
    public string? InversePropertyName { get; init; }
}

public enum NavigationType
{
    OneToMany,
    ManyToOne,
    ManyToMany
}
```

**Implementation Notes:**
- Singleton service (metadata doesn't change at runtime)
- Use `IDbContextFactory<T>` to create temporary context for analysis
- Build cache in constructor (eager initialization)
- Use `ConcurrentDictionary` for thread safety

---

### 2. Field Specification Parser

**Purpose:** Parse and expand field specifications from user input

**Key Responsibilities:**
- Parse dot-notation field paths (`"department.organisation.name"`)
- Expand wildcards (`"department"` → all department fields recursively)
- Detect and prevent circular references
- Validate field existence
- Build field selection tree

**Public API:**
```csharp
public interface IFieldSpecificationParser
{
    ParsedFieldSelection Parse(string entityName, string[] fieldSpecs);
    FieldExpansionResult ExpandWildcard(string entityName, string fieldPath, int maxDepth = 5);
}
```

**Data Structures:**
```csharp
public class ParsedFieldSelection
{
    public string EntityName { get; init; }
    public IReadOnlyList<FieldNode> Fields { get; init; }
    public int MaxDepth { get; init; }
}

public class FieldNode
{
    public string Name { get; init; }
    public string FullPath { get; init; } // e.g., "department.organisation.name"
    public FieldNodeType Type { get; init; }
    public IReadOnlyList<FieldNode>? Children { get; init; }
}

public enum FieldNodeType
{
    Scalar,       // firstName, budget
    Navigation,   // department { ... }
    Collection    // employees { ... }
}
```

**Parsing Logic:**

**Input:** `["firstName", "lastName", "department", "role.title"]`

**Process:**
1. `"firstName"` → Scalar field, add to tree
2. `"lastName"` → Scalar field, add to tree
3. `"department"` → Navigation property, expand recursively:
   - Add all scalar fields: `id`, `name`, `budget`, `head`
   - Add nested navigation: `organisation { id, name, industry, foundYear }`
4. `"role.title"` → Nested scalar, add to tree

**Output Tree:**
```
Employee
├── firstName
├── lastName
├── department
│   ├── id
│   ├── name
│   ├── budget
│   ├── head
│   └── organisation
│       ├── id
│       ├── name
│       ├── industry
│       └── foundYear
└── role
    └── title
```

---

### 3. GraphQL Query Builder

**Purpose:** Generate valid GraphQL query strings from field selections

**Public API:**
```csharp
public interface IGraphQLQueryBuilder
{
    string BuildQuery(QueryRequest request);
    string BuildFieldSelection(ParsedFieldSelection selection);
}
```

**Input:**
```csharp
public class QueryRequest
{
    public string EntityName { get; init; }
    public string[] Fields { get; init; }
    public FilterExpression? Filters { get; init; }
    public SortExpression? Sort { get; init; }
    public int? First { get; init; }
    public string? After { get; init; }
}

public class FilterExpression
{
    public Dictionary<string, object> Conditions { get; init; }
    public FilterLogic Logic { get; init; } = FilterLogic.And;
}

public class SortExpression
{
    public List<SortField> Fields { get; init; }
}

public class SortField
{
    public string FieldName { get; init; }
    public SortDirection Direction { get; init; }
}
```

**Output Example:**
```graphql
{
  employees(
    where: { department: { budget: { gte: 1000000 } } }
    order: [{ lastName: ASC }, { firstName: ASC }]
    first: 50
  ) {
    firstName
    lastName
    department {
      id
      name
      budget
      head
      organisation {
        id
        name
        industry
        foundYear
      }
    }
    role {
      title
    }
  }
}
```

---

### 4. Dynamic Flattening Middleware

**Purpose:** Intercept GraphQL execution and return flattened results

**Implementation Approach:**

**Option A: HotChocolate Middleware**
```csharp
public class DynamicFlatteningMiddleware
{
    private readonly FieldDelegate _next;

    public async ValueTask InvokeAsync(IMiddlewareContext context)
    {
        // Execute standard GraphQL query
        await _next(context);

        // Check if flattening is requested
        var flattenArg = context.Selection.Arguments["flatten"];
        if (flattenArg?.Value is BooleanValueNode { Value: true })
        {
            // Transform hierarchical result to flat
            var hierarchicalResult = context.Result;
            var flattenedResult = FlattenResult(hierarchicalResult, context.Selection);
            context.Result = flattenedResult;
        }
    }

    private object FlattenResult(object hierarchical, ISelection selection)
    {
        // Implementation: walk object graph and flatten
        throw new NotImplementedException();
    }
}
```

**Option B: Custom GraphQL Field (Recommended)**
```csharp
[ExtendObjectType(typeof(Query))]
public class DynamicFlatQuery
{
    [UsePaging(IncludeTotalCount = true)]
    [UseFiltering]
    [UseSorting]
    public IQueryable<Dictionary<string, object?>> GetDynamicFlat(
        [Service] ApplicationDbContext context,
        [Service] IDynamicQueryExecutor executor,
        string entity,
        string[] fields,
        string? where = null,
        string? order = null)
    {
        return executor.BuildAndExecute(entity, fields, where, order);
    }
}
```

---

### 5. Dynamic Query Executor

**Purpose:** Build and execute dynamic LINQ queries with flattening

**Public API:**
```csharp
public interface IDynamicQueryExecutor
{
    IQueryable<Dictionary<string, object?>> BuildAndExecute(
        string entityName,
        string[] fields,
        string? whereClause,
        string? orderClause);
}
```

**Implementation Strategy:**

**Step 1: Parse fields and build metadata**
```csharp
var metadata = _modelAnalyzer.GetEntityMetadata(entityName);
var parsedFields = _fieldParser.Parse(entityName, fields);
```

**Step 2: Build field selector using Dynamic LINQ**
```csharp
// Build anonymous type selector
// e.g., "new { FirstName, LastName, Department.Name as DepartmentName }"

var selectFields = new List<string>();
foreach (var field in parsedFields.Fields)
{
    var flatName = field.FullPath.Replace(".", "_");
    selectFields.Add($"{field.FullPath} as {flatName}");
}

var selectClause = $"new {{ {string.Join(", ", selectFields)} }}";
```

**Step 3: Get DbSet and apply dynamic select**
```csharp
var entityType = metadata.ClrType;
var dbSet = context.GetType()
    .GetMethod("Set", Type.EmptyTypes)!
    .MakeGenericMethod(entityType)
    .Invoke(context, null);

var query = ((IQueryable)dbSet)
    .Select(selectClause); // Dynamic LINQ
```

**Step 4: Apply filtering and sorting**
```csharp
if (!string.IsNullOrEmpty(whereClause))
    query = query.Where(whereClause); // Dynamic LINQ

if (!string.IsNullOrEmpty(orderClause))
    query = query.OrderBy(orderClause); // Dynamic LINQ
```

**Step 5: Convert to Dictionary for GraphQL**
```csharp
return query.Select(obj => ConvertToDictionary(obj));
```

---

## Data Flow Example

### User Request
```json
POST /api/query/flatten
{
  "entity": "employees",
  "fields": ["firstName", "lastName", "department", "role.title"],
  "filters": { "department.budget": { "gte": 1000000 } },
  "sort": ["lastName", "firstName"],
  "limit": 50
}
```

### Step 1: Field Parsing
```
EntityModelAnalyzer.GetEntityMetadata("employees")
  → Employee metadata with all properties

FieldSpecificationParser.Parse("employees", [...])
  → Expands "department" to all nested fields
  → Validates all field paths
  → Returns ParsedFieldSelection
```

### Step 2: GraphQL Query Building
```graphql
{
  employees(
    where: { department: { budget: { gte: 1000000 } } }
    order: [{ lastName: ASC }, { firstName: ASC }]
    first: 50
  ) {
    firstName
    lastName
    department { id, name, budget, head, organisation { id, name, industry, foundYear } }
    role { title }
  }
}
```

### Step 3: Dynamic Query Execution
```csharp
// Generated Dynamic LINQ
context.Employees
  .Select("new { " +
    "FirstName as firstName, " +
    "LastName as lastName, " +
    "Department.Id as department_id, " +
    "Department.Name as department_name, " +
    "Department.Budget as department_budget, " +
    "Department.Organisation.Name as department_organisation_name, " +
    "Role.Title as role_title" +
  "}")
  .Where("Department.Budget >= 1000000")
  .OrderBy("LastName, FirstName")
  .Take(50)
```

### Step 4: SQL Generation (EF Core)
```sql
SELECT
  e.FirstName as firstName,
  e.LastName as lastName,
  d.Id as department_id,
  d.Name as department_name,
  d.Budget as department_budget,
  o.Name as department_organisation_name,
  r.Title as role_title
FROM Employees e
INNER JOIN Departments d ON e.DepartmentId = d.Id
INNER JOIN Organisations o ON d.OrganisationId = o.Id
INNER JOIN Roles r ON e.RoleId = r.Id
WHERE d.Budget >= 1000000
ORDER BY e.LastName, e.FirstName
LIMIT 50
```

### Step 5: Response
```json
{
  "data": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "department_id": 1,
      "department_name": "Engineering",
      "department_budget": 5000000,
      "department_organisation_name": "TechCorp Inc",
      "role_title": "Senior Developer"
    }
  ],
  "totalCount": 127
}
```

---

## Security Considerations

### 1. Input Validation
- Whitelist entity names against known entities
- Validate field names against entity metadata
- Sanitize filter operators (whitelist: eq, neq, gt, gte, lt, lte, contains, etc.)
- Limit query complexity (max fields, max depth, max filter conditions)

### 2. SQL Injection Prevention
- Use parameterized queries via EF Core
- Validate all Dynamic LINQ inputs
- Never concatenate user input into SQL strings

### 3. Query Complexity Limits
```csharp
public class QueryComplexityLimits
{
    public const int MaxFieldCount = 50;
    public const int MaxNestingDepth = 5;
    public const int MaxFilterConditions = 20;
    public const int MaxPageSize = 200;
}
```

---

## Performance Optimization

### 1. Metadata Caching
- Build entity metadata cache at startup
- Use singleton lifetime for `IEntityModelAnalyzer`
- No runtime reflection after initialization

### 2. Query Optimization
- All operations at database level (IQueryable)
- Proper JOIN generation via navigation properties
- Index usage via WHERE clause optimization

### 3. Result Streaming
- Use `IAsyncEnumerable<T>` for large result sets
- Cursor-based pagination for efficient paging

---

## Testing Strategy

### Unit Tests
- `EntityModelAnalyzer`: Metadata extraction accuracy
- `FieldSpecificationParser`: Wildcard expansion, validation
- `GraphQLQueryBuilder`: Query string generation
- `DynamicQueryExecutor`: Query building logic

### Integration Tests
- End-to-end query execution with real database
- SQL verification (ensure WHERE/ORDER BY in SQL)
- Performance benchmarks

### Test Data
- Use existing `SampleDataSeeder` from QueryBuilderDemo.Tests

---

## Implementation Phases

### Phase 1: Core Infrastructure (Days 1-2)
1. Install `System.Linq.Dynamic.Core` package
2. Implement `IEntityModelAnalyzer` with caching
3. Write unit tests for metadata extraction
4. Implement `Result<T>` and validation utilities

### Phase 2: Field Parsing (Days 3-4)
1. Implement `IFieldSpecificationParser`
2. Add wildcard expansion logic
3. Add circular reference detection
4. Write comprehensive unit tests

### Phase 3: Dynamic Query Building (Days 5-7)
1. Implement `IDynamicQueryExecutor`
2. Add Dynamic LINQ integration
3. Test SQL generation with EF Core logging
4. Validate database-level execution

### Phase 4: GraphQL Integration (Days 8-9)
1. Create `DynamicFlatQuery` GraphQL endpoint
2. Add HotChocolate middleware for flattening
3. Test with Banana Cake Pop
4. Write integration tests

### Phase 5: REST API (Day 10)
1. Create REST controller
2. Add Swagger documentation
3. Test with Postman/curl

### Phase 6: Performance & Documentation (Days 11-12)
1. Performance testing and optimization
2. Update GRAPHQL_EXAMPLES.md
3. Add code comments and XML docs
4. Final integration testing

---

## Success Criteria

- [ ] User can specify ANY field combination dynamically
- [ ] System auto-expands wildcards (e.g., "department" → all fields)
- [ ] All filtering, sorting, pagination happens in SQL
- [ ] Zero in-memory operations on query results
- [ ] Query complexity limits enforced
- [ ] Input validation prevents SQL injection
- [ ] Performance targets met (<500ms end-to-end)
- [ ] Comprehensive test coverage (>80%)
- [ ] Complete documentation with examples

---

**End of Architecture Document**
