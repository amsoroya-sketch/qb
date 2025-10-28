# GraphQL Query Examples and Usage Guide

This document provides practical examples of GraphQL queries demonstrating various features and solving common use cases.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Queries](#basic-queries)
3. [Filtering Examples](#filtering-examples)
4. [Sorting Examples](#sorting-examples)
5. [Pagination Examples](#pagination-examples)
6. [Complex Nested Queries](#complex-nested-queries)
7. [Real-World Use Cases](#real-world-use-cases)
8. [Performance Tips](#performance-tips)

---

## Getting Started

### Accessing the GraphQL Playground

1. Start the application:
   ```bash
   cd QueryBuilderDemo.GraphQL
   dotnet run
   ```

2. Open Banana Cake Pop (GraphQL IDE):
   ```
   http://localhost:5000/graphql
   ```

3. The schema is automatically documented and explorable via introspection.

---

## Basic Queries

### Query 1: Fetch All Organisations

**Query:**
```graphql
{
  organisations(first: 10) {
    nodes {
      id
      name
      industry
      foundYear
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "organisations": {
      "nodes": [
        {
          "id": 1,
          "name": "TechCorp Inc",
          "industry": "Technology",
          "foundYear": 2010
        },
        {
          "id": 2,
          "name": "BuildRight Ltd",
          "industry": "Construction",
          "foundYear": 2005
        }
      ]
    }
  }
}
```

**Key Points:**
- `first: 10` limits results (pagination)
- `nodes` contains the actual data
- Only requested fields are returned

---

### Query 2: Fetch Organisation with Departments

**Query:**
```graphql
{
  organisations(first: 5) {
    nodes {
      name
      departments {
        id
        name
        budget
        head
      }
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "organisations": {
      "nodes": [
        {
          "name": "TechCorp Inc",
          "departments": [
            {
              "id": 1,
              "name": "Engineering",
              "budget": 5000000,
              "head": "Alice Johnson"
            },
            {
              "id": 2,
              "name": "Human Resources",
              "budget": 1000000,
              "head": "Bob Smith"
            }
          ]
        }
      ]
    }
  }
}
```

**What Happens Behind the Scenes:**
```sql
-- Query 1: Fetch organisations
SELECT o.Name FROM Organisations o LIMIT 5;

-- Query 2: Fetch related departments
SELECT d.Id, d.Name, d.Budget, d.Head, d.OrganisationId
FROM Departments d
WHERE d.OrganisationId IN (1, 2);
```

---

## Filtering Examples

### Filter 1: Employees by Department

**Query:**
```graphql
{
  employees(
    first: 20
    where: { departmentId: { eq: 1 } }
  ) {
    nodes {
      firstName
      lastName
      email
      department {
        name
      }
    }
  }
}
```

**Generated SQL:**
```sql
SELECT e.FirstName, e.LastName, e.Email
FROM Employees e
WHERE e.DepartmentId = 1
LIMIT 20;
```

---

### Filter 2: Projects by Budget Range

**Query:**
```graphql
{
  projects(
    first: 10
    where: {
      budget: { gte: 100000, lte: 1000000 }
    }
  ) {
    nodes {
      title
      budget
      deadline
      client {
        name
      }
    }
  }
}
```

**Generated SQL:**
```sql
SELECT p.Title, p.Budget, p.Deadline
FROM Projects p
WHERE p.Budget >= 100000 AND p.Budget <= 1000000
LIMIT 10;
```

---

### Filter 3: Employees with Active Certifications

**Query:**
```graphql
{
  employees(first: 10) {
    nodes {
      firstName
      lastName
      certifications(
        where: { validUntil: { gte: "2025-10-28T00:00:00.000Z" } }
      ) {
        name
        issuer
        validUntil
      }
    }
  }
}
```

**Use Case:** Find employees with valid (non-expired) certifications.

**Generated SQL:**
```sql
-- Query 1: Fetch employees
SELECT e.FirstName, e.LastName FROM Employees e LIMIT 10;

-- Query 2: Fetch active certifications
SELECT c.Name, c.Issuer, c.ValidUntil
FROM Certifications c
WHERE c.EmployeeId IN (1, 2, 3, ...)
  AND c.ValidUntil >= '2025-10-28T00:00:00.000Z';
```

---

### Filter 4: Complex OR Conditions

**Query:**
```graphql
{
  employees(
    first: 20
    where: {
      or: [
        { departmentId: { eq: 1 } }
        { departmentId: { eq: 2 } }
      ]
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

**Generated SQL:**
```sql
SELECT e.FirstName, e.LastName
FROM Employees e
WHERE e.DepartmentId = 1 OR e.DepartmentId = 2
LIMIT 20;
```

---

## Sorting Examples

### Sort 1: Departments by Name

**Query:**
```graphql
{
  organisations(first: 5) {
    nodes {
      name
      departments(order: { name: ASC }) {
        name
        budget
      }
    }
  }
}
```

**Key Feature:** Nested sorting! Departments are sorted within each organisation.

**Generated SQL:**
```sql
-- Departments sorted per organisation
SELECT d.Name, d.Budget
FROM Departments d
WHERE d.OrganisationId IN (1, 2)
ORDER BY d.Name ASC;
```

---

### Sort 2: Employees by Multiple Fields

**Query:**
```graphql
{
  departments(first: 10) {
    nodes {
      name
      employees(
        order: [
          { lastName: ASC }
          { firstName: ASC }
        ]
      ) {
        firstName
        lastName
        email
      }
    }
  }
}
```

**Use Case:** Display employees alphabetically by last name, then first name.

**Generated SQL:**
```sql
SELECT e.FirstName, e.LastName, e.Email
FROM Employees e
WHERE e.DepartmentId IN (1, 2, 3, ...)
ORDER BY e.LastName ASC, e.FirstName ASC;
```

---

### Sort 3: Projects by Deadline (Descending)

**Query:**
```graphql
{
  clients(first: 5) {
    nodes {
      name
      projects(order: { deadline: DESC }) {
        title
        deadline
        budget
      }
    }
  }
}
```

**Use Case:** Show projects with nearest deadlines first.

---

### Sort 4: Skills by Category and Name

**Query:**
```graphql
{
  employees(first: 10) {
    nodes {
      firstName
      lastName
      skills(
        order: [
          { category: ASC }
          { name: ASC }
        ]
      ) {
        name
        category
        proficiency
      }
    }
  }
}
```

**Use Case:** Group skills by category, then alphabetically within each category.

**Result Structure:**
```json
{
  "firstName": "John",
  "skills": [
    { "name": "Leadership", "category": "Management" },
    { "name": "Project Management", "category": "Management" },
    { "name": "C#", "category": "Programming" },
    { "name": "Python", "category": "Programming" }
  ]
}
```

---

## Pagination Examples

### Pagination 1: Cursor-Based (Forward)

**Query:**
```graphql
{
  employees(first: 5) {
    edges {
      cursor
      node {
        firstName
        lastName
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "employees": {
      "edges": [
        {
          "cursor": "MA==",
          "node": { "firstName": "John", "lastName": "Doe" }
        },
        {
          "cursor": "MQ==",
          "node": { "firstName": "Jane", "lastName": "Smith" }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "MA==",
        "endCursor": "MQ=="
      }
    }
  }
}
```

---

### Pagination 2: Fetching Next Page

**Query:**
```graphql
{
  employees(first: 5, after: "MQ==") {
    edges {
      cursor
      node {
        firstName
        lastName
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Key Points:**
- Use `endCursor` from previous response as `after` parameter
- `hasNextPage` tells you if more data exists
- Cursors are opaque (base64 encoded positions)

---

### Pagination 3: Total Count

**Query:**
```graphql
{
  employees(first: 10) {
    totalCount
    nodes {
      firstName
      lastName
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "employees": {
      "totalCount": 147,
      "nodes": [...]
    }
  }
}
```

**Use Case:** Display "Showing 1-10 of 147 employees"

---

## Complex Nested Queries

### Complex 1: Three-Level Hierarchy with Sorting

**Query:**
```graphql
{
  organisations(first: 5) {
    nodes {
      name
      departments(order: { name: ASC }) {
        name
        employees(order: [{ lastName: ASC }, { firstName: ASC }]) {
          firstName
          lastName
          projects(order: { deadline: ASC }) {
            title
            deadline
          }
        }
      }
    }
  }
}
```

**Key Feature:** Sorting at every level of the hierarchy!

**Traditional EF Core:**
```csharp
// ❌ This does NOT work
var orgs = context.Organisations
    .Include(o => o.Departments.OrderBy(d => d.Name))  // Ignored!
    .ThenInclude(d => d.Employees.OrderBy(e => e.LastName))  // Ignored!
    .ToList();
```

**GraphQL with HotChocolate:**
✅ Works perfectly! Each level is sorted at the database level.

---

### Complex 2: Filtered and Sorted Nested Collections

**Query:**
```graphql
{
  projects(
    first: 10
    where: { deadline: { gte: "2025-01-01" } }
  ) {
    nodes {
      title
      deadline
      tasks(
        where: { status: { neq: "Completed" } }
        order: { dueDate: ASC }
      ) {
        title
        status
        dueDate
        assignedTo {
          firstName
          lastName
        }
      }
    }
  }
}
```

**Use Case:** Show upcoming projects with their incomplete tasks, sorted by due date.

---

### Complex 3: Many-to-Many with Filtering

**Query:**
```graphql
{
  teams(first: 5) {
    nodes {
      name
      purpose
      members(
        where: {
          or: [
            { roleId: { eq: 1 } }
            { roleId: { eq: 2 } }
          ]
        }
        order: { lastName: ASC }
      ) {
        firstName
        lastName
        role {
          title
          level
        }
      }
    }
  }
}
```

**Use Case:** Show teams with only senior-level members, sorted alphabetically.

---

## Real-World Use Cases

### Use Case 1: Employee Directory

**Requirement:** Show all employees grouped by department, sorted alphabetically.

**Query:**
```graphql
{
  organisations(first: 10) {
    nodes {
      name
      departments(order: { name: ASC }) {
        name
        employees(order: [{ lastName: ASC }, { firstName: ASC }]) {
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

**Frontend Display:**
```
TechCorp Inc
  ├─ Engineering
  │   ├─ Doe, John (Senior Developer)
  │   └─ Smith, Jane (Junior Developer)
  └─ Human Resources
      └─ Johnson, Michael (HR Manager)
```

---

### Use Case 2: Project Dashboard

**Requirement:** Show all active projects with their incomplete tasks, sorted by urgency.

**Query:**
```graphql
{
  projects(
    first: 20
    where: { deadline: { gte: "2025-10-28" } }
    order: { deadline: ASC }
  ) {
    nodes {
      title
      deadline
      budget
      client {
        name
      }
      tasks(
        where: { status: { neq: "Completed" } }
        order: { dueDate: ASC }
      ) {
        title
        status
        dueDate
        assignedTo {
          firstName
          lastName
        }
      }
      teamMembers {
        firstName
        lastName
        role {
          title
        }
      }
    }
  }
}
```

**Frontend Display:**
```
Project: E-Commerce Platform Redesign
  Deadline: 2025-12-31
  Client: Acme Corporation
  Team: John Doe (Senior Developer), Jane Smith (Junior Developer)
  Pending Tasks:
    - Implement payment gateway (Due: 2025-11-30) - Jane Smith
    - Setup CI/CD pipeline (Due: 2025-12-15) - John Doe
```

---

### Use Case 3: Skill Matrix

**Requirement:** Show which employees have which skills, grouped by category.

**Query:**
```graphql
{
  employees(first: 50) {
    nodes {
      firstName
      lastName
      department {
        name
      }
      skills(order: [{ category: ASC }, { name: ASC }]) {
        name
        category
        proficiency
      }
    }
  }
}
```

**Frontend Display (Table):**
| Employee | Department | Programming | Management | Soft Skills |
|----------|------------|-------------|------------|-------------|
| John Doe | Engineering | C# (Expert), Python (Advanced) | Leadership (Expert) | - |
| Jane Smith | Engineering | C# (Intermediate), JavaScript (Intermediate) | - | - |

---

### Use Case 4: Certification Tracking

**Requirement:** Alert employees whose certifications are expiring soon.

**Query:**
```graphql
{
  employees(first: 100) {
    nodes {
      firstName
      lastName
      email
      certifications(
        where: {
          validUntil: {
            gte: "2025-10-28"
            lte: "2025-12-31"
          }
        }
        order: { validUntil: ASC }
      ) {
        name
        issuer
        validUntil
      }
    }
  }
}
```

**Use Case:** Generate email alerts for certifications expiring in the next 60 days.

---

### Use Case 5: Team Workload Analysis

**Requirement:** Show team members and their current project assignments.

**Query:**
```graphql
{
  teams(first: 10) {
    nodes {
      name
      purpose
      members(order: { lastName: ASC }) {
        firstName
        lastName
        projects {
          title
          deadline
        }
        tasks(where: { status: { neq: "Completed" } }) {
          title
          dueDate
        }
      }
    }
  }
}
```

**Frontend Display:**
```
Team: Platform Team
  John Doe
    Projects: E-Commerce Platform, Mobile App
    Pending Tasks: 3
  Jane Smith
    Projects: E-Commerce Platform, Mobile App
    Pending Tasks: 2
```

---

## Performance Tips

### Tip 1: Always Use Pagination

**❌ Bad:**
```graphql
{
  employees {  # Could return thousands!
    firstName
  }
}
```

**✅ Good:**
```graphql
{
  employees(first: 50) {
    nodes {
      firstName
    }
  }
}
```

---

### Tip 2: Request Only Needed Fields

**❌ Bad (Over-fetching):**
```graphql
{
  employees(first: 10) {
    nodes {
      id
      firstName
      lastName
      email
      department { id name budget head }
      role { id title level description }
      skills { id name proficiency category }
      certifications { id name issuer validUntil }
      projects { id title deadline budget }
      teams { id name purpose size }
    }
  }
}
```

**✅ Good (Selective):**
```graphql
{
  employees(first: 10) {
    nodes {
      firstName
      lastName
      department { name }
    }
  }
}
```

**Savings:** 80-90% reduction in data transfer.

---

### Tip 3: Avoid Deep Nesting Without Pagination

**❌ Bad:**
```graphql
{
  organisations {
    departments {
      employees {        # Could be thousands
        projects {       # Could be tens of thousands
          tasks { ... }  # Could be hundreds of thousands!
        }
      }
    }
  }
}
```

**✅ Good:**
```graphql
{
  organisations(first: 5) {
    nodes {
      departments(first: 10) {
        nodes {
          employees(first: 20) {
            nodes {
              firstName
            }
          }
        }
      }
    }
  }
}
```

---

### Tip 4: Use Filtering to Reduce Data at Source

**❌ Bad (Fetch all, filter client-side):**
```graphql
{
  employees(first: 1000) {  # Fetch all
    nodes {
      firstName
      departmentId
    }
  }
  # Then filter in JavaScript: employees.filter(e => e.departmentId === 5)
}
```

**✅ Good (Filter at database):**
```graphql
{
  employees(
    first: 50
    where: { departmentId: { eq: 5 } }
  ) {
    nodes {
      firstName
    }
  }
}
```

---

## Filtering Operators Reference

| Operator | GraphQL | Example | SQL Equivalent |
|----------|---------|---------|----------------|
| **Equals** | `eq` | `{ age: { eq: 25 } }` | `WHERE age = 25` |
| **Not Equals** | `neq` | `{ status: { neq: "Completed" } }` | `WHERE status != 'Completed'` |
| **Greater Than** | `gt` | `{ budget: { gt: 100000 } }` | `WHERE budget > 100000` |
| **Greater or Equal** | `gte` | `{ deadline: { gte: "2025-01-01" } }` | `WHERE deadline >= '2025-01-01'` |
| **Less Than** | `lt` | `{ salary: { lt: 50000 } }` | `WHERE salary < 50000` |
| **Less or Equal** | `lte` | `{ age: { lte: 65 } }` | `WHERE age <= 65` |
| **Contains** | `contains` | `{ name: { contains: "John" } }` | `WHERE name LIKE '%John%'` |
| **Starts With** | `startsWith` | `{ email: { startsWith: "admin" } }` | `WHERE email LIKE 'admin%'` |
| **Ends With** | `endsWith` | `{ email: { endsWith: "@company.com" } }` | `WHERE email LIKE '%@company.com'` |
| **In List** | `in` | `{ id: { in: [1, 2, 3] } }` | `WHERE id IN (1, 2, 3)` |
| **Not In List** | `nin` | `{ status: { nin: ["Completed", "Archived"] } }` | `WHERE status NOT IN ('Completed', 'Archived')` |

---

## Sorting Options Reference

| Sort Direction | GraphQL | Example |
|----------------|---------|---------|
| **Ascending** | `ASC` | `order: { name: ASC }` |
| **Descending** | `DESC` | `order: { deadline: DESC }` |
| **Multiple Fields** | Array | `order: [{ lastName: ASC }, { firstName: ASC }]` |

---

## Common Errors and Solutions

### Error 1: Field Cost Exceeded

**Error:**
```json
{
  "errors": [{
    "message": "The maximum allowed field cost was exceeded.",
    "extensions": {
      "fieldCost": 1561,
      "maxFieldCost": 1000
    }
  }]
}
```

**Solution:** Add pagination to limit results.
```graphql
employees(first: 10) { ... }  # Instead of employees { ... }
```

---

### Error 2: Invalid DateTime Format

**Error:**
```json
{
  "errors": [{
    "message": "DateTime cannot parse the given literal"
  }]
}
```

**Solution:** Use ISO 8601 format with timezone.
```graphql
# ❌ Bad
where: { validUntil: { gte: "2025-10-28" } }

# ✅ Good
where: { validUntil: { gte: "2025-10-28T00:00:00.000Z" } }
```

---

### Error 3: Maximum Depth Exceeded

**Error:**
```json
{
  "errors": [{
    "message": "The GraphQL document has an execution depth of 4 which exceeds the max allowed"
  }]
}
```

**Solution:** Reduce query nesting depth or increase limit in configuration.

---

## Conclusion

This guide demonstrates how GraphQL with HotChocolate solves real-world data fetching challenges:

1. **Nested Sorting:** Works at all levels (impossible in traditional EF Core)
2. **Flexible Filtering:** Rich operators for all data types
3. **Efficient Pagination:** Cursor-based pagination handles large datasets
4. **Performance:** Database-level optimization via projections
5. **Developer Experience:** Self-documenting, type-safe schema

For more details on the architecture and how it works internally, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

**Generated:** 2025-10-28
**Framework:** .NET 8, HotChocolate 15.x
