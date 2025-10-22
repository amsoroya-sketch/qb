# QueryBuilder Demo Project

## Overview

This is a comprehensive .NET 8 demonstration project showcasing the QueryBuilder utility with Entity Framework Core and SQLite. The project includes 15 interconnected entity models representing a business domain with organizations, employees, projects, clients, and related entities.

## Project Structure

```
/home/dev/Development/qb/
├── QueryBuilder.cs                           # Original QueryBuilder utility
├── PROJECT_CONSTRAINTS.md                    # Project requirements and patterns
├── README.md                                 # This file
├── QueryBuilderDemo.sln                      # Solution file
├── QueryBuilderDemo/                         # Main class library
│   ├── QueryBuilderDemo.csproj
│   ├── Models/                               # 15 Entity classes
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
│   │   ├── ApplicationDbContext.cs          # DbContext with all configurations
│   │   └── SampleDataSeeder.cs              # Comprehensive test data
│   └── Utils/
│       ├── QueryBuilder.cs                   # QueryBuilder utility (copied)
│       └── Model/
│           ├── WhereAttribute.cs
│           ├── DLINQOrderbyAttribute.cs
│           └── RecursiveIncludeLevelAttribute.cs
└── QueryBuilderDemo.Tests/                   # xUnit test project
    ├── QueryBuilderDemo.Tests.csproj
    ├── Helpers/
    │   └── TestDbContextFactory.cs           # In-memory DB factory
    └── QueryBuilderTests/
        └── BasicQueryBuilderTests.cs         # 8 comprehensive tests
```

## Entity Relationships

### Core Entities (15 Total)

1. **Organisation** → Departments (1:N)
2. **Department** → Employees (1:N), belongs to Organisation
3. **Employee** → Department, Role, Schedule (1:1), Projects (N:M), Skills (N:M), Teams (N:M), Certifications (1:N), Tasks (1:N)
4. **Project** → Client, Tasks (1:N), TeamMembers/Employees (N:M)
5. **Task** → Project, AssignedTo/Employee (optional)
6. **Location** → Clients (1:N)
7. **Role** → Employees (1:N)
8. **Skill** → Employees (N:M)
9. **Certification** → Employee
10. **Team** → Members/Employees (N:M), Meetings (1:N)
11. **Meeting** → Team
12. **Schedule** → Employee (1:1)
13. **Client** → Location, Projects (1:N), Invoices (1:N)
14. **Invoice** → Client, Payments (1:N)
15. **Payment** → Invoice

## Technology Stack

- **.NET 8.0**
- **Entity Framework Core 8.0.11** with SQLite
- **System.Linq.Dynamic.Core 1.4.8** (for dynamic LINQ queries)
- **xUnit** (testing framework)
- **FluentAssertions 7.0.0** (readable test assertions)

## Sample Data

The `SampleDataSeeder` creates realistic, interconnected test data:

- **2 Organisations**: "TechCorp Inc" (Technology), "BuildRight Ltd" (Construction)
- **6 Departments**: Engineering, HR, Finance, Construction, Project Management, Safety
- **6 Employees**: Across different departments and roles
- **6 Roles**: Senior Developer, Junior Developer, HR Manager, Accountant, Construction Manager, Safety Officer
- **6 Skills**: C#, Python, JavaScript, Project Management, Communication, Leadership
- **3 Locations**: San Francisco, New York, London
- **3 Clients**: Acme Corporation, GlobalTech Solutions, City Infrastructure Authority
- **4 Projects**: E-Commerce Platform, Mobile App, Cloud Migration, Bridge Construction
- **8+ Tasks**: Various statuses (Completed, In Progress, Pending)
- **3 Teams**: Platform Team, Infrastructure Team, Construction Crew
- **4 Meetings**: Sprint planning, standups, reviews, briefings
- **3 Schedules**: Employee work schedules
- **3 Certifications**: Azure, Scrum Master, OSHA Safety
- **3 Invoices** with **4+ Payments**

## Key Features

### 1. Proper Entity Configuration
- All foreign keys explicitly defined
- Navigation properties are nullable (`?`)
- Collections initialized with `= new()`
- Decimal precision configured for monetary fields (18,2)
- Proper cascade delete behavior

### 2. QueryBuilder Integration
- Supports dynamic includes (e.g., `"Departments.Employees.Role"`)
- Handles complex navigation paths
- Works with many-to-many relationships
- Custom attributes for filtering and ordering

### 3. Comprehensive Testing
- In-memory SQLite database for fast tests
- Fresh database per test (isolation)
- Tests for single-level includes
- Tests for nested includes (2-3 levels deep)
- Tests for many-to-many relationships
- Data validation tests

## Running the Project

### Build the Solution
```bash
cd /home/dev/Development/qb
dotnet build
```

### Run Tests
```bash
dotnet test
```

### Run Tests with Detailed Output
```bash
dotnet test --logger "console;verbosity=detailed"
```

## Test Results

All 8 tests pass successfully:
- ✅ `BuildQuery_WithSingleLevelInclude_LoadsRelatedData`
- ✅ `BuildQuery_WithNestedIncludes_LoadsNestedRelatedData`
- ✅ `BuildQuery_WithMultipleNestedIncludes_LoadsAllData`
- ✅ `Context_CanQueryEmployees_WithComplexRelationships`
- ✅ `Context_CanQueryProjects_WithTasksAndTeamMembers`
- ✅ `Context_CanQueryClients_WithInvoicesAndPayments`
- ✅ `Context_CanQueryTeams_WithMembersAndMeetings`
- ✅ `SampleData_HasCorrectCounts`

## Usage Examples

### Basic Query with Single Include
```csharp
var includes = new HashSet<string> { "Departments" };
var orgs = context.Organisations
    .BuildQuery(includes)
    .ToList();
```

### Nested Includes
```csharp
var includes = new HashSet<string> { "Departments.Employees.Role" };
var orgs = context.Organisations
    .BuildQuery(includes)
    .ToList();
```

### Multiple Parallel Includes
```csharp
var includes = new HashSet<string>
{
    "Department.Organisation",
    "Role",
    "Projects.Client",
    "Skills"
};
var employees = context.Employees
    .BuildQuery(includes)
    .ToList();
```

### Complex Multi-Level Includes
```csharp
var includes = new HashSet<string>
{
    "Tasks.AssignedTo.Department",
    "TeamMembers.Skills",
    "Client.Location"
};
var projects = context.Projects
    .BuildQuery(includes)
    .ToList();
```

## Design Patterns Followed

### From PROJECT_CONSTRAINTS.md
✅ All entities have `Id` as primary key
✅ Use `List<T>` for collections (not `ICollection<T>`)
✅ All navigation properties are nullable
✅ Foreign keys explicitly defined
✅ Collections initialized with `= new()`
✅ String properties default to `string.Empty`
✅ Fluent API used in `OnModelCreating`
✅ Decimal precision set for monetary fields
✅ Cascade delete configured appropriately
✅ Many-to-many configured with `HasMany().WithMany()`

## Notes

### Nullable Reference Warnings
The project builds successfully with **0 errors**. The 28 warnings are nullable reference warnings from QueryBuilder.cs, which are acceptable as they're in the copied utility code and don't affect functionality.

### Package Vulnerability Warning
There's a known vulnerability in `System.Linq.Dynamic.Core 1.4.8`. This is a demonstration project, but in production, you should upgrade to a newer version when available.

## Next Steps

To extend this project, you could:
1. Add more comprehensive unit tests for QueryBuilder methods
2. Add integration tests with real database
3. Implement API endpoints using the entities
4. Add validation attributes to entities
5. Implement repository pattern
6. Add AutoMapper for DTOs
7. Add Swagger for API documentation
8. Implement CQRS pattern with MediatR

## Success Criteria Met

✅ All 15 entities created with proper relationships
✅ DbContext configured with Fluent API
✅ Sample data seeder with realistic interconnected data
✅ Test project structure created
✅ 8 comprehensive tests passing
✅ `dotnet build` succeeds with 0 errors
✅ QueryBuilder utility integrated and working
✅ All attribute classes created
✅ TestDbContextFactory helper created
✅ All patterns from PROJECT_CONSTRAINTS.md followed

---

**Created:** 2025-10-21
**Build Status:** ✅ Success (0 errors)
**Test Status:** ✅ All tests passing (8/8)
