# GraphQL Query Examples and Usage Guide

This document provides practical examples of GraphQL queries demonstrating various features and solving common use cases.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Queries](#basic-queries)
3. [Filtering Examples](#filtering-examples)
4. [Sorting Examples](#sorting-examples)
5. [Pagination Examples](#pagination-examples)
6. [Complex Nested Queries](#complex-nested-queries)
7. [Flattened Queries](#flattened-queries)
8. [Real-World Use Cases](#real-world-use-cases)
9. [Performance Tips](#performance-tips)

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

## Flattened Queries

### What Are Flattened Queries?

Flattened queries return **denormalized data** where related entities are combined into a single flat structure. Instead of nested JSON objects, you get rows with prefixed field names.

**When to Use Flattened Queries:**
- Exporting data to CSV/Excel
- Feeding data to reporting/analytics tools
- Building data tables with server-side filtering/sorting
- Integrating with systems that expect flat data structures
- Avoiding client-side data transformation

**When to Use Hierarchical Queries:**
- Building nested UI components (trees, accordions)
- Representing natural parent-child relationships
- Minimizing data duplication in responses

---

### Comparison: Hierarchical vs Flattened

**Hierarchical Query:**
```graphql
{
  organisations(first: 1) {
    nodes {
      name
      industry
      departments {
        name
        budget
        employees {
          firstName
          lastName
        }
      }
    }
  }
}
```

**Hierarchical Response:**
```json
{
  "data": {
    "organisations": {
      "nodes": [{
        "name": "TechCorp Inc",
        "industry": "Technology",
        "departments": [
          {
            "name": "Engineering",
            "budget": 5000000,
            "employees": [
              { "firstName": "John", "lastName": "Doe" },
              { "firstName": "Jane", "lastName": "Smith" }
            ]
          }
        ]
      }]
    }
  }
}
```

**Flattened Query:**
```graphql
{
  organisationDepartmentEmployeesFlat(first: 10) {
    nodes {
      organisationName
      organisationIndustry
      departmentName
      departmentBudget
      employeeFirstName
      employeeLastName
    }
  }
}
```

**Flattened Response:**
```json
{
  "data": {
    "organisationDepartmentEmployeesFlat": {
      "nodes": [
        {
          "organisationName": "TechCorp Inc",
          "organisationIndustry": "Technology",
          "departmentName": "Engineering",
          "departmentBudget": 5000000,
          "employeeFirstName": "John",
          "employeeLastName": "Doe"
        },
        {
          "organisationName": "TechCorp Inc",
          "organisationIndustry": "Technology",
          "departmentName": "Engineering",
          "departmentBudget": 5000000,
          "employeeFirstName": "Jane",
          "employeeLastName": "Smith"
        }
      ]
    }
  }
}
```

**Key Difference:** Organisation and Department data are repeated for each employee in the flattened format.

---

### Available Flattened Queries

| Query | Entities Combined | Use Case |
|-------|-------------------|----------|
| `organisationDepartmentsFlat` | Organisation + Department | Org-department report |
| `organisationDepartmentEmployeesFlat` | Organisation + Department + Employee + Role | Complete employee directory |
| `departmentEmployeesFlat` | Department + Employee + Role | Department roster |
| `employeeProjectsFlat` | Employee + Department + Role + Project + Client | Project assignments |
| `projectTasksFlat` | Project + Client + Task + Assigned Employee | Task management |
| `employeeSkillsFlat` | Employee + Department + Skill | Skill matrix |
| `clientProjectsFlat` | Client + Location + Project | Client portfolio |

---

### Flattened Query 1: Organisation-Department-Employee

**Query:**
```graphql
{
  organisationDepartmentEmployeesFlat(
    first: 20
    where: {
      organisationName: { contains: "Tech" }
    }
    order: { employeeLastName: ASC }
  ) {
    nodes {
      organisationId
      organisationName
      organisationIndustry
      departmentId
      departmentName
      departmentBudget
      employeeId
      employeeFirstName
      employeeLastName
      employeeEmail
      roleTitle
      roleLevel
    }
    totalCount
  }
}
```

**Use Case:** Export all employees from tech companies to Excel.

**Generated SQL:**
```sql
SELECT
  o.Id AS OrganisationId,
  o.Name AS OrganisationName,
  o.Industry AS OrganisationIndustry,
  d.Id AS DepartmentId,
  d.Name AS DepartmentName,
  d.Budget AS DepartmentBudget,
  e.Id AS EmployeeId,
  e.FirstName AS EmployeeFirstName,
  e.LastName AS EmployeeLastName,
  e.Email AS EmployeeEmail,
  r.Title AS RoleTitle,
  r.Level AS RoleLevel
FROM Employees e
JOIN Departments d ON e.DepartmentId = d.Id
JOIN Organisations o ON d.OrganisationId = o.Id
JOIN Roles r ON e.RoleId = r.Id
WHERE o.Name LIKE '%Tech%'
ORDER BY e.LastName ASC
LIMIT 20;
```

---

### Flattened Query 2: Employee-Project Assignments (Many-to-Many)

**Query:**
```graphql
{
  employeeProjectsFlat(
    first: 50
    where: {
      projectDeadline: { gte: "2025-11-01T00:00:00.000Z" }
    }
    order: [
      { employeeLastName: ASC }
      { projectDeadline: ASC }
    ]
  ) {
    nodes {
      employeeFirstName
      employeeLastName
      employeeEmail
      departmentName
      roleTitle
      projectTitle
      projectDeadline
      projectBudget
      clientName
    }
  }
}
```

**Use Case:** Show which employees are assigned to upcoming projects.

**Key Feature:** Automatically flattens the many-to-many relationship between employees and projects. Each employee-project pair creates one row.

**Response:**
```json
{
  "data": {
    "employeeProjectsFlat": {
      "nodes": [
        {
          "employeeFirstName": "John",
          "employeeLastName": "Doe",
          "departmentName": "Engineering",
          "roleTitle": "Senior Developer",
          "projectTitle": "E-Commerce Platform",
          "projectDeadline": "2025-12-31",
          "clientName": "Acme Corporation"
        },
        {
          "employeeFirstName": "John",
          "employeeLastName": "Doe",
          "departmentName": "Engineering",
          "roleTitle": "Senior Developer",
          "projectTitle": "Mobile App Redesign",
          "projectDeadline": "2025-11-15",
          "clientName": "Beta Industries"
        }
      ]
    }
  }
}
```

**Notice:** John Doe appears twice because he's assigned to 2 projects.

---

### Flattened Query 3: Project-Task Breakdown

**Query:**
```graphql
{
  projectTasksFlat(
    first: 100
    where: {
      taskStatus: { neq: "Completed" }
    }
    order: { taskDueDate: ASC }
  ) {
    nodes {
      projectTitle
      projectDeadline
      clientName
      clientIndustry
      taskTitle
      taskStatus
      taskDueDate
      assignedToFirstName
      assignedToLastName
    }
  }
}
```

**Use Case:** Generate a task report showing all incomplete tasks across projects.

**Key Feature:** Handles nullable assigned employee (tasks can be unassigned).

---

### Flattened Query 4: Employee Skills Matrix

**Query:**
```graphql
{
  employeeSkillsFlat(
    first: 200
    where: {
      skillCategory: { eq: "Programming" }
      skillProficiency: { in: ["Expert", "Advanced"] }
    }
    order: [
      { employeeLastName: ASC }
      { skillName: ASC }
    ]
  ) {
    nodes {
      employeeFirstName
      employeeLastName
      departmentName
      skillName
      skillCategory
      skillProficiency
    }
  }
}
```

**Use Case:** Find all employees with advanced programming skills.

**Key Feature:** Many-to-many relationship (employees can have multiple skills).

**Response:**
```json
{
  "data": {
    "employeeSkillsFlat": {
      "nodes": [
        {
          "employeeFirstName": "John",
          "employeeLastName": "Doe",
          "departmentName": "Engineering",
          "skillName": "C#",
          "skillCategory": "Programming",
          "skillProficiency": "Expert"
        },
        {
          "employeeFirstName": "John",
          "employeeLastName": "Doe",
          "departmentName": "Engineering",
          "skillName": "Python",
          "skillCategory": "Programming",
          "skillProficiency": "Advanced"
        }
      ]
    }
  }
}
```

---

### Flattened Query 5: Client Projects Portfolio

**Query:**
```graphql
{
  clientProjectsFlat(
    first: 50
    where: {
      projectBudget: { gte: 100000 }
    }
    order: { projectDeadline: DESC }
  ) {
    nodes {
      clientName
      clientIndustry
      locationCity
      locationState
      locationCountry
      projectTitle
      projectDeadline
      projectBudget
    }
  }
}
```

**Use Case:** Client portfolio report showing all high-value projects.

---

### Filtering on Flattened Fields

**All fields in flattened queries support filtering!**

**Example 1: Filter by any field in the flattened structure**
```graphql
{
  organisationDepartmentEmployeesFlat(
    first: 20
    where: {
      and: [
        { organisationIndustry: { eq: "Technology" } }
        { departmentBudget: { gte: 1000000 } }
        { roleLevel: { in: ["Senior", "Lead"] } }
      ]
    }
  ) {
    nodes {
      organisationName
      departmentName
      employeeFirstName
      employeeLastName
      roleTitle
    }
  }
}
```

**Use Case:** Find senior employees in well-funded departments of tech companies.

**Example 2: Complex filtering on many-to-many**
```graphql
{
  employeeProjectsFlat(
    first: 100
    where: {
      or: [
        { clientName: { contains: "Acme" } }
        { projectBudget: { gte: 500000 } }
      ]
      and: [
        { roleLevel: { neq: "Junior" } }
      ]
    }
  ) {
    nodes {
      employeeFirstName
      employeeLastName
      projectTitle
      clientName
    }
  }
}
```

**Use Case:** Find non-junior employees working on either Acme projects or high-budget projects.

---

### Sorting on Flattened Fields

**You can sort by any field in the flattened structure!**

**Example 1: Multi-level sorting**
```graphql
{
  employeeProjectsFlat(
    first: 50
    order: [
      { departmentName: ASC }
      { employeeLastName: ASC }
      { projectDeadline: ASC }
    ]
  ) {
    nodes {
      departmentName
      employeeLastName
      employeeFirstName
      projectTitle
      projectDeadline
    }
  }
}
```

**Result:** Grouped by department, then by employee, then by project deadline.

**Example 2: Sort by calculated urgency**
```graphql
{
  projectTasksFlat(
    first: 100
    where: { taskStatus: { neq: "Completed" } }
    order: { taskDueDate: ASC }
  ) {
    nodes {
      projectTitle
      taskTitle
      taskDueDate
      assignedToLastName
    }
  }
}
```

**Use Case:** Most urgent tasks first.

---

### Pagination on Flattened Queries

**Flattened queries support the same pagination as hierarchical queries.**

**Example:**
```graphql
{
  employeeSkillsFlat(first: 25, after: "cursor123") {
    edges {
      cursor
      node {
        employeeFirstName
        employeeLastName
        skillName
        skillProficiency
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

**Key Point:** Pagination happens **after** flattening, so `totalCount` reflects the number of flattened rows, not entities.

**Example:** If John Doe has 5 skills:
- Hierarchical query: 1 employee node
- Flattened query: 5 employee-skill rows

---

### Performance Characteristics

**All flattened queries execute at the database level using LINQ `Select()` and `SelectMany()`.**

**Advantages:**
1. ✅ No in-memory joins
2. ✅ Filtering happens in SQL WHERE clause
3. ✅ Sorting happens in SQL ORDER BY clause
4. ✅ Pagination happens in SQL LIMIT/OFFSET
5. ✅ Only requested fields are selected (projection)

**Trade-offs:**
- More data duplication (organisation/department data repeated)
- Larger response size compared to hierarchical
- Better for systems expecting flat data

**Comparison:**

| Aspect | Hierarchical | Flattened |
|--------|-------------|-----------|
| Data duplication | Minimal | High (parent data repeated) |
| Response size | Smaller | Larger |
| Database operations | Multiple queries (N+1 potential) | Single query with joins |
| Export to CSV | Requires transformation | Direct export |
| Nested UI | Natural fit | Requires grouping |
| Reporting tools | Requires flattening | Direct use |

---

### Real-World Integration Examples

**Example 1: Export to CSV**
```javascript
// Frontend: Fetch flattened data
const response = await fetch('http://localhost:5256/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `{
      employeeProjectsFlat(first: 1000) {
        nodes {
          employeeFirstName
          employeeLastName
          departmentName
          projectTitle
          projectDeadline
        }
      }
    }`
  })
});

const data = await response.json();
const rows = data.data.employeeProjectsFlat.nodes;

// Convert to CSV (already flat!)
const csv = [
  'First Name,Last Name,Department,Project,Deadline',
  ...rows.map(r => `${r.employeeFirstName},${r.employeeLastName},${r.departmentName},${r.projectTitle},${r.projectDeadline}`)
].join('\n');

// Download CSV
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'employee-projects.csv';
a.click();
```

**Example 2: Server-Side Data Table (ag-Grid, DataTables, etc.)**
```javascript
// Configure data table with server-side filtering/sorting
const gridOptions = {
  rowModelType: 'serverSide',
  serverSideDatasource: {
    getRows: async (params) => {
      // Build GraphQL query from grid state
      const { startRow, endRow, filterModel, sortModel } = params.request;

      const query = `{
        employeeProjectsFlat(
          first: ${endRow - startRow}
          where: ${buildWhereClause(filterModel)}
          order: ${buildOrderClause(sortModel)}
        ) {
          nodes {
            employeeFirstName
            employeeLastName
            departmentName
            projectTitle
            projectDeadline
          }
          totalCount
        }
      }`;

      const response = await fetch('http://localhost:5256/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      params.success({
        rowData: data.data.employeeProjectsFlat.nodes,
        rowCount: data.data.employeeProjectsFlat.totalCount
      });
    }
  }
};
```

---

### Choosing Between Hierarchical and Flattened

**Use Hierarchical When:**
- Building nested UI components (org chart, file tree)
- Minimizing response size
- Representing natural parent-child relationships
- Client needs nested JSON structure

**Use Flattened When:**
- Exporting to CSV/Excel
- Feeding data to reporting tools (Power BI, Tableau)
- Building data tables with server-side operations
- Integrating with systems expecting flat data
- Avoiding client-side data transformation

**You can use both in the same application!** Choose based on the specific use case.

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
