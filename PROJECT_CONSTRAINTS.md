# Project Constraints - QueryBuilder Testing Project

## Version: 1.0
## Created: 2025-10-21

## Overview
This is a .NET project to demonstrate and test the QueryBuilder utility with a comprehensive entity model using SQLite and Entity Framework Core.

## Technology Stack
- .NET 8.0 or later
- Entity Framework Core with SQLite
- xUnit for unit testing
- FluentAssertions for test assertions

## Architecture Patterns

### 1. Entity Model Design
**MUST follow these patterns:**

- All entities MUST have an `Id` property as primary key
- Use proper navigation properties for relationships
- Use `List<T>` for collection navigation properties (not `ICollection<T>`)
- Many-to-many relationships MUST be configured using `HasMany().WithMany()`
- Foreign keys MUST be explicitly defined for one-to-many relationships
- All navigation properties MUST be nullable to prevent required navigation warnings

**Example:**
```csharp
public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public string Head { get; set; } = string.Empty;

    // Foreign key - explicit
    public int OrganisationId { get; set; }

    // Navigation properties - nullable
    public Organisation? Organisation { get; set; }
    public List<Employee> Employees { get; set; } = new();
}
```

### 2. DbContext Configuration
**MUST follow these patterns:**

- Use `OnModelCreating` for all relationship configurations
- Use Fluent API for complex relationships
- Enable cascade delete appropriately
- Configure decimal precision for monetary values: `.HasPrecision(18, 2)`
- Use string length constraints where appropriate

**Example:**
```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Department>()
        .HasOne(d => d.Organisation)
        .WithMany(o => o.Departments)
        .HasForeignKey(d => d.OrganisationId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Employee>()
        .HasMany(e => e.Projects)
        .WithMany(p => p.TeamMembers)
        .UsingEntity(j => j.ToTable("EmployeeProjects"));
}
```

### 3. Test Project Structure
**MUST follow these patterns:**

- Use xUnit as testing framework
- Use FluentAssertions for readable assertions
- Each test MUST use a fresh in-memory SQLite database
- Tests MUST be isolated (no shared database state)
- Use `[Fact]` for single tests, `[Theory]` for parameterized tests
- Test method names MUST follow pattern: `MethodName_Scenario_ExpectedResult`

**Example:**
```csharp
[Fact]
public void BuildQuery_WithNestedIncludes_ReturnsCorrectData()
{
    // Arrange
    using var context = CreateInMemoryContext();
    SeedTestData(context);

    // Act
    var result = context.Organisations
        .BuildQuery(new HashSet<string> { "Departments.Employees" })
        .ToList();

    // Assert
    result.Should().NotBeEmpty();
    result.First().Departments.Should().NotBeEmpty();
    result.First().Departments.First().Employees.Should().NotBeEmpty();
}
```

### 4. Sample Data Seeding
**MUST follow these patterns:**

- Create a dedicated seeding method: `SeedTestData(DbContext context)`
- Create realistic, interconnected test data
- MUST include data for ALL entity types
- MUST demonstrate all relationship types (1:1, 1:N, N:M)
- Use meaningful test data (not "Test1", "Test2")

**Example entities to create:**
- At least 2 Organisations with different industries
- At least 3 Departments per Organisation
- At least 5 Employees with various roles, skills, projects
- At least 3 Projects with tasks and team members
- At least 2 Clients with invoices and payments
- At least 2 Teams with meetings

## QueryBuilder Testing Requirements

### MUST test these QueryBuilder methods:

1. **BuildQuery** - Test with various include paths
   - Single level includes
   - Nested includes (2-3 levels deep)
   - Multiple parallel includes
   - Wildcard includes if supported

2. **BuildDLINQQuery** - Test with field selection
   - Scalar field selection
   - Navigation property selection
   - Mixed scalar and navigation selection

3. **BuildFlattenedQuery** - Test with collection flattening
   - Single collection flattening
   - Nested collection flattening
   - Multiple collection flattening

4. **SplitIncludes** - Test include path parsing
   - Valid include paths
   - Wildcard paths
   - Invalid paths

### Test Scenarios (MUST cover all):

1. **Relationship Loading:**
   - Load Organisation with Departments
   - Load Department with Organisation and Employees
   - Load Employee with Department, Role, Projects, Skills
   - Load Project with Tasks and TeamMembers
   - Load Client with Location, Projects, Invoices

2. **Deep Navigation:**
   - Organisation -> Departments -> Employees -> Projects
   - Client -> Projects -> Tasks -> AssignedTo (Employee)
   - Team -> Members (Employees) -> Department -> Organisation

3. **Many-to-Many:**
   - Employee <-> Projects
   - Employee <-> Skills
   - Team <-> Employees

4. **Complex Queries:**
   - Filter + Include + Select
   - OrderBy + Include + Take
   - GroupBy with includes

## Anti-Patterns (DO NOT USE)

1. **DO NOT** use `ICollection<T>` for navigation properties (use `List<T>`)
2. **DO NOT** create circular references without proper configuration
3. **DO NOT** forget to dispose DbContext in tests
4. **DO NOT** use hardcoded connection strings (use in-memory for tests)
5. **DO NOT** create entities without proper navigation setup
6. **DO NOT** skip testing error scenarios

## Validation Checklist

Before marking implementation complete, verify:
- [ ] All 15+ entities are defined with proper relationships
- [ ] DbContext configures all relationships in OnModelCreating
- [ ] Sample data seeds successfully with realistic data
- [ ] All tests pass (dotnet test shows 0 failures)
- [ ] QueryBuilder methods work with all entity types
- [ ] No compilation warnings or errors
- [ ] Tests use isolated databases (no shared state)
- [ ] All navigation properties load correctly with BuildQuery

## Project Structure

```
/home/dev/Development/qb/
├── QueryBuilder.cs (existing)
├── PROJECT_CONSTRAINTS.md (this file)
├── QueryBuilderDemo/
│   ├── QueryBuilderDemo.csproj
│   ├── Models/
│   │   ├── Organisation.cs
│   │   ├── Department.cs
│   │   ├── Employee.cs
│   │   ├── Project.cs
│   │   ├── Task.cs
│   │   ├── Location.cs
│   │   ├── Role.cs
│   │   ├── Skill.cs
│   │   ├── Certification.cs
│   │   ├── Team.cs
│   │   ├── Meeting.cs
│   │   ├── Schedule.cs
│   │   ├── Client.cs
│   │   ├── Invoice.cs
│   │   └── Payment.cs
│   ├── Data/
│   │   ├── ApplicationDbContext.cs
│   │   └── SampleDataSeeder.cs
│   └── Utils/
│       └── QueryBuilder.cs (copy from root)
└── QueryBuilderDemo.Tests/
    ├── QueryBuilderDemo.Tests.csproj
    ├── Helpers/
    │   └── TestDbContextFactory.cs
    ├── EntityTests/
    │   ├── OrganisationTests.cs
    │   ├── EmployeeTests.cs
    │   └── [others]
    └── QueryBuilderTests/
        ├── BuildQueryTests.cs
        ├── BuildDLINQQueryTests.cs
        └── BuildFlattenedQueryTests.cs
```

## Success Criteria

Project is considered complete when:
1. All entities are created and properly configured
2. DbContext successfully creates database schema
3. Sample data seeds without errors
4. All unit tests pass (minimum 20 comprehensive tests)
5. QueryBuilder functionality is thoroughly tested with complex relationships
6. `dotnet test` shows 0 errors, 0 warnings
7. Code follows all patterns documented here
