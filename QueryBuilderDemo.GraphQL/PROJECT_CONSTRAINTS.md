# Project Constraints and Architecture Guide

**Project:** Dynamic GraphQL Query Builder with Intelligent Flattening
**Last Updated:** 2025-10-28
**Version:** 1.0

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Code Patterns and Conventions](#code-patterns-and-conventions)
4. [Security Requirements](#security-requirements)
5. [Performance Requirements](#performance-requirements)
6. [Testing Requirements](#testing-requirements)
7. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Architecture Overview

### System Goal
Build a production-ready intelligent query builder that:
1. Accepts simplified field specifications from users
2. Automatically expands wildcards and detects entity relationships
3. Generates optimized GraphQL queries dynamically
4. Executes queries with 100% database-level operations (NO in-memory processing)
5. Returns flattened JSON with path-based field names

### Two-Layer Architecture

```
User Request (Simplified)
    ↓
[Layer 1: Query Builder Service]
  - Entity Model Analyzer
  - Field Specification Parser
  - GraphQL Query Generator
    ↓
GraphQL Query (Auto-generated)
    ↓
[Layer 2: GraphQL Execution with Flattening]
  - HotChocolate Middleware
  - Dynamic LINQ Builder
  - Result Flattener
    ↓
Flat JSON Response
```

---

## Technology Stack

### Required Packages
- **HotChocolate 15.x** - GraphQL server
- **Entity Framework Core 8.0** - ORM and model introspection
- **System.Linq.Dynamic.Core 1.4.x** - Dynamic LINQ query building
- **SQLite** - Development database (production: SQL Server/PostgreSQL)

### Target Framework
- **.NET 8.0**

---

## Code Patterns and Conventions

### 1. Dependency Injection Pattern

**✅ CORRECT:**
```csharp
public class EntityModelAnalyzer
{
    private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
    private readonly ILogger<EntityModelAnalyzer> _logger;

    public EntityModelAnalyzer(
        IDbContextFactory<ApplicationDbContext> contextFactory,
        ILogger<EntityModelAnalyzer> logger)
    {
        _contextFactory = contextFactory;
        _logger = logger;
    }
}
```

**❌ INCORRECT:**
```csharp
// Don't use direct DbContext injection for singletons
public class EntityModelAnalyzer
{
    private readonly ApplicationDbContext _context; // ❌ DbContext lifetime issue
}
```

**Register in Program.cs:**
```csharp
builder.Services.AddDbContextFactory<ApplicationDbContext>(...);
builder.Services.AddSingleton<IEntityModelAnalyzer, EntityModelAnalyzer>();
builder.Services.AddScoped<IQueryBuilderService, QueryBuilderService>();
```

---

### 2. EF Core Model Introspection Pattern

**Example from existing codebase:**
```csharp
// See: QueryBuilderDemo.Tests/Data/ApplicationDbContext.cs
var entityTypes = context.Model.GetEntityTypes();
foreach (var entityType in entityTypes)
{
    var clrType = entityType.ClrType;
    var properties = entityType.GetProperties();
    var navigations = entityType.GetNavigations();
}
```

**✅ MUST USE:** EF Core's `IModel` and `IEntityType` for metadata, NOT reflection directly.

---

### 3. Error Handling Pattern

**✅ CORRECT:**
```csharp
public class QueryBuilderService
{
    public Result<GraphQLQuery> BuildQuery(QueryRequest request)
    {
        try
        {
            // Validate input
            var validationResult = ValidateRequest(request);
            if (!validationResult.IsSuccess)
                return Result<GraphQLQuery>.Failure(validationResult.Errors);

            // Build query
            var query = GenerateQuery(request);

            _logger.LogInformation("Successfully built query for entity {Entity}", request.Entity);
            return Result<GraphQLQuery>.Success(query);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError(ex, "Invalid operation while building query");
            return Result<GraphQLQuery>.Failure($"Query building failed: {ex.Message}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error building query");
            throw; // Re-throw unexpected exceptions in production
        }
    }
}
```

**Use Result<T> pattern, not exceptions for business logic failures.**

---

### 4. Null Safety Pattern

**✅ CORRECT:**
```csharp
// Enable nullable reference types in .csproj
<Nullable>enable</Nullable>

// Use nullable annotations
public class FieldSpecification
{
    public string EntityName { get; set; } = string.Empty;
    public List<string> Fields { get; set; } = new();
    public FilterExpression? Filters { get; set; } // Nullable
    public SortExpression? Sort { get; set; } // Nullable
}
```

**❌ INCORRECT:**
```csharp
public string EntityName { get; set; } // ❌ Nullable warning
```

---

### 5. Existing GraphQL Pattern (MUST FOLLOW)

**Example from FlattenedQuery.cs:24-41:**
```csharp
[UsePaging(IncludeTotalCount = true, DefaultPageSize = 50, MaxPageSize = 200)]
[UseProjection]
[UseFiltering]
[UseSorting]
public IQueryable<OrganisationDepartmentFlat> GetOrganisationDepartmentsFlat(
    [Service] ApplicationDbContext context)
{
    return context.Departments
        .Select(d => new OrganisationDepartmentFlat
        {
            OrganisationId = d.Organisation!.Id,
            OrganisationName = d.Organisation.Name,
            // ... field mappings
        });
}
```

**KEY PRINCIPLES:**
- Return `IQueryable<T>` for database-level execution
- Use HotChocolate attributes: `[UsePaging]`, `[UseProjection]`, `[UseFiltering]`, `[UseSorting]`
- Use `[Service]` attribute for dependency injection in resolvers
- NEVER use `.ToList()`, `.ToArray()`, or `.AsEnumerable()` before returning

---

### 6. Dynamic LINQ Pattern

**✅ CORRECT:**
```csharp
using System.Linq.Dynamic.Core;

var query = context.Set(entityType)
    .Select($"new {{ {string.Join(", ", fieldMappings)} }}")
    .Where(whereClause)
    .OrderBy(orderClause);
```

**Validation Required:**
- Sanitize all user input to prevent LINQ injection
- Whitelist field names against known entity properties
- Validate filter operators against allowed list

---

## Security Requirements

### 1. Input Validation

**MUST IMPLEMENT:**
```csharp
public class QueryRequestValidator
{
    private readonly IEntityModelAnalyzer _modelAnalyzer;

    public ValidationResult Validate(QueryRequest request)
    {
        // 1. Entity name must exist in model
        if (!_modelAnalyzer.EntityExists(request.EntityName))
            return ValidationResult.Failure("Invalid entity name");

        // 2. All field names must be valid
        foreach (var field in request.Fields)
        {
            if (!_modelAnalyzer.IsValidFieldPath(request.EntityName, field))
                return ValidationResult.Failure($"Invalid field: {field}");
        }

        // 3. Filter operators must be whitelisted
        if (request.Filters != null)
        {
            var allowedOperators = new[] { "eq", "neq", "gt", "gte", "lt", "lte", "contains", "startsWith", "endsWith", "in", "nin" };
            if (request.Filters.ContainsInvalidOperators(allowedOperators))
                return ValidationResult.Failure("Invalid filter operator");
        }

        return ValidationResult.Success();
    }
}
```

### 2. SQL Injection Prevention

**MUST USE:**
- Parameterized queries via EF Core (NEVER string concatenation)
- Dynamic LINQ with validated inputs only
- Whitelist approach for field names and operators

**❌ NEVER:**
```csharp
// Don't build raw SQL strings
var sql = $"SELECT * FROM {tableName} WHERE {fieldName} = '{value}'";
```

### 3. Query Complexity Limits

**MUST ENFORCE:**
```csharp
public class QueryComplexityValidator
{
    private const int MaxFieldCount = 50;
    private const int MaxNestingDepth = 5;
    private const int MaxFilterConditions = 20;

    public ValidationResult Validate(QueryRequest request)
    {
        if (request.Fields.Count > MaxFieldCount)
            return ValidationResult.Failure($"Too many fields (max: {MaxFieldCount})");

        var maxDepth = CalculateMaxNestingDepth(request.Fields);
        if (maxDepth > MaxNestingDepth)
            return ValidationResult.Failure($"Nesting too deep (max: {MaxNestingDepth})");

        return ValidationResult.Success();
    }
}
```

---

## Performance Requirements

### 1. Database-Level Operations (CRITICAL)

**✅ MUST:**
- All filtering, sorting, pagination MUST execute in SQL
- Use `IQueryable<T>` throughout the pipeline
- Verify generated SQL with logging in development

**❌ NEVER:**
```csharp
// Don't materialize before filtering
var results = context.Employees.ToList() // ❌ Loads all into memory
    .Where(e => e.Department.Budget > 1000000)
    .ToList();

// ✅ CORRECT
var results = context.Employees
    .Where(e => e.Department.Budget > 1000000)
    .ToList(); // Executes WHERE in SQL
```

### 2. Caching Strategy

**MUST IMPLEMENT:**
```csharp
public class EntityModelAnalyzer
{
    private readonly ConcurrentDictionary<string, EntityMetadata> _metadataCache = new();

    public EntityMetadata GetEntityMetadata(string entityName)
    {
        return _metadataCache.GetOrAdd(entityName, name =>
        {
            using var context = _contextFactory.CreateDbContext();
            return BuildMetadata(context, name);
        });
    }
}
```

**Cache at application startup:**
- Entity metadata (properties, relationships)
- Relationship graph
- Field name → property mappings

**DO NOT cache:**
- Query results (use HotChocolate's built-in caching)
- User-specific data

### 3. Performance Targets

| Operation | Target | Max Acceptable |
|-----------|--------|----------------|
| Metadata analysis (cached) | <10ms | 50ms |
| Query building | <50ms | 200ms |
| Query execution (100 rows) | <200ms | 1000ms |
| Total request (end-to-end) | <500ms | 2000ms |

**Log slow queries:**
```csharp
var stopwatch = Stopwatch.StartNew();
var result = await ExecuteQuery(query);
stopwatch.Stop();

if (stopwatch.ElapsedMilliseconds > 500)
    _logger.LogWarning("Slow query detected: {Duration}ms", stopwatch.ElapsedMilliseconds);
```

---

## Testing Requirements

### 1. Unit Tests (REQUIRED)

**Coverage Target: >80%**

```csharp
// Example test structure
public class EntityModelAnalyzerTests
{
    private readonly EntityModelAnalyzer _analyzer;
    private readonly ApplicationDbContext _context;

    [Fact]
    public void GetEntityMetadata_ExistingEntity_ReturnsValidMetadata()
    {
        // Arrange
        var entityName = "Employee";

        // Act
        var metadata = _analyzer.GetEntityMetadata(entityName);

        // Assert
        Assert.NotNull(metadata);
        Assert.Equal("Employee", metadata.Name);
        Assert.Contains(metadata.Properties, p => p.Name == "FirstName");
    }

    [Theory]
    [InlineData("InvalidEntity")]
    [InlineData("")]
    [InlineData(null)]
    public void GetEntityMetadata_InvalidEntity_ThrowsException(string entityName)
    {
        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => _analyzer.GetEntityMetadata(entityName));
    }
}
```

### 2. Integration Tests (REQUIRED)

**Test database-level execution:**
```csharp
[Fact]
public async Task BuildAndExecuteQuery_WithFiltering_ExecutesInDatabase()
{
    // Arrange
    var request = new QueryRequest
    {
        EntityName = "employees",
        Fields = new[] { "firstName", "department.name" },
        Filters = new { department = new { budget = new { gte = 1000000 } } }
    };

    // Act
    var query = _queryBuilder.BuildQuery(request);
    var sql = _context.ToQueryString(query); // Get generated SQL
    var results = await query.ToListAsync();

    // Assert
    Assert.Contains("WHERE", sql);
    Assert.Contains("budget >= 1000000", sql, StringComparison.OrdinalIgnoreCase);
    Assert.All(results, r => Assert.True(r.DepartmentBudget >= 1000000));
}
```

### 3. SQL Verification (REQUIRED)

**Log and verify generated SQL:**
```csharp
// In development mode, log all SQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlite(...)
        .EnableSensitiveDataLogging()
        .LogTo(Console.WriteLine, LogLevel.Information);
});
```

---

## Anti-Patterns to Avoid

### ❌ 1. N+1 Query Problem

**BAD:**
```csharp
var employees = context.Employees.ToList();
foreach (var employee in employees)
{
    var department = context.Departments.Find(employee.DepartmentId); // ❌ N queries
}
```

**GOOD:**
```csharp
var employees = context.Employees
    .Include(e => e.Department)
    .ToList(); // 1 query with JOIN
```

### ❌ 2. Loading Entire Tables

**BAD:**
```csharp
var allEmployees = context.Employees.ToList(); // ❌ Could be millions of rows
var filtered = allEmployees.Where(e => e.DepartmentId == 5);
```

**GOOD:**
```csharp
var filtered = context.Employees
    .Where(e => e.DepartmentId == 5)
    .ToList(); // Filtering in SQL
```

### ❌ 3. Reflection Overuse

**BAD:**
```csharp
var properties = typeof(Employee).GetProperties(); // ❌ Slow, runs on every request
```

**GOOD:**
```csharp
// Cache metadata at startup
private static readonly Dictionary<Type, PropertyInfo[]> _propertyCache = new();
```

### ❌ 4. Magic Strings

**BAD:**
```csharp
var field = "FirstName"; // ❌ No compile-time safety
```

**GOOD:**
```csharp
public static class EntityFields
{
    public const string FirstName = nameof(Employee.FirstName);
}
```

### ❌ 5. Swallowing Exceptions

**BAD:**
```csharp
try
{
    var result = BuildQuery(request);
}
catch
{
    return null; // ❌ Silent failure
}
```

**GOOD:**
```csharp
try
{
    var result = BuildQuery(request);
}
catch (Exception ex)
{
    _logger.LogError(ex, "Query building failed for {Entity}", request.EntityName);
    throw new QueryBuildingException("Failed to build query", ex);
}
```

---

## Validation Checklist for All Code

Before submitting any code, verify:

- [ ] **Compilation**: `dotnet build` shows 0 errors, 0 warnings
- [ ] **Null Safety**: No nullable warnings (run with `<WarningsAsErrors>nullable</WarningsAsErrors>`)
- [ ] **Dependencies**: All injected via constructor (no `new` for services)
- [ ] **IQueryable**: All data access returns `IQueryable<T>`, not materialized collections
- [ ] **Input Validation**: All user inputs validated before use
- [ ] **Error Handling**: Proper logging and Result<T> pattern
- [ ] **Tests**: Unit tests written with >80% coverage
- [ ] **SQL Verification**: Generated SQL logged and verified in development
- [ ] **Performance**: No operations in tight loops, proper caching
- [ ] **Documentation**: XML comments on public APIs

---

## Example: Complete Service Implementation

```csharp
/// <summary>
/// Analyzes EF Core model to extract entity metadata for dynamic query building.
/// Thread-safe singleton with cached metadata.
/// </summary>
public interface IEntityModelAnalyzer
{
    /// <summary>
    /// Gets metadata for the specified entity.
    /// </summary>
    /// <exception cref="InvalidOperationException">Entity not found in model</exception>
    EntityMetadata GetEntityMetadata(string entityName);

    /// <summary>
    /// Validates if a field path is valid for the given entity.
    /// </summary>
    bool IsValidFieldPath(string entityName, string fieldPath);
}

public class EntityModelAnalyzer : IEntityModelAnalyzer
{
    private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;
    private readonly ILogger<EntityModelAnalyzer> _logger;
    private readonly ConcurrentDictionary<string, EntityMetadata> _cache;

    public EntityModelAnalyzer(
        IDbContextFactory<ApplicationDbContext> contextFactory,
        ILogger<EntityModelAnalyzer> logger)
    {
        _contextFactory = contextFactory ?? throw new ArgumentNullException(nameof(contextFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _cache = new ConcurrentDictionary<string, EntityMetadata>(StringComparer.OrdinalIgnoreCase);

        // Warm up cache at construction
        InitializeCache();
    }

    public EntityMetadata GetEntityMetadata(string entityName)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            throw new ArgumentException("Entity name cannot be null or empty", nameof(entityName));

        if (_cache.TryGetValue(entityName, out var metadata))
            return metadata;

        throw new InvalidOperationException($"Entity '{entityName}' not found in model");
    }

    public bool IsValidFieldPath(string entityName, string fieldPath)
    {
        if (string.IsNullOrWhiteSpace(fieldPath))
            return false;

        var metadata = GetEntityMetadata(entityName);
        var parts = fieldPath.Split('.');

        // Traverse the path and validate each part
        var currentMetadata = metadata;
        foreach (var part in parts)
        {
            if (!currentMetadata.HasProperty(part))
                return false;

            if (currentMetadata.IsNavigationProperty(part))
                currentMetadata = GetEntityMetadata(currentMetadata.GetNavigationTargetType(part));
        }

        return true;
    }

    private void InitializeCache()
    {
        using var context = _contextFactory.CreateDbContext();
        var entityTypes = context.Model.GetEntityTypes();

        foreach (var entityType in entityTypes)
        {
            var metadata = BuildMetadata(entityType);
            _cache.TryAdd(entityType.ClrType.Name, metadata);

            _logger.LogDebug("Cached metadata for entity {EntityName}", entityType.ClrType.Name);
        }

        _logger.LogInformation("Initialized entity metadata cache with {Count} entities", _cache.Count);
    }

    private EntityMetadata BuildMetadata(IEntityType entityType)
    {
        // Implementation here...
        throw new NotImplementedException();
    }
}
```

---

**End of PROJECT_CONSTRAINTS.md**
