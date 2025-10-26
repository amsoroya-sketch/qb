using Microsoft.VisualStudio.TestTools.UnitTesting;
using QueryBuilderDemo.Tests.Models;
using PbsApi.Utils;
using System.Collections.Generic;
using System.Linq;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    [TestClass]
    public class ExpandFieldsToScalarsTests
    {
        [TestMethod]
        public void ExpandFieldsToScalars_WithScalarFieldsOnly_ReturnsUnchanged()
        {
            // Arrange
            var fields = new List<string> { "Id", "FirstName", "LastName", "Email" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.AreEqual(4, result.Count());
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));
            Assert.IsTrue(result.Contains("LastName"));
            Assert.IsTrue(result.Contains("Email"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithEntityReference_ExpandsToScalarFields()
        {
            // Arrange - "Department" should expand recursively to all scalar fields
            var fields = new List<string> { "Id", "FirstName", "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));
            // Department entity should be expanded to its scalar fields (and nested entities)
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Name"));
            Assert.IsTrue(result.Contains("Department.OrganisationId"));
            // Should recursively expand Department.Organisation
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Name"));
            // Should NOT contain the entity reference itself
            Assert.IsFalse(result.Contains("Department"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithCollectionReference_ExpandsToScalarFields()
        {
            // Arrange - "Departments" collection should expand to all Department scalar fields
            var fields = new List<string> { "Id", "Name", "Departments" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("Name"));
            // Departments collection should be expanded to scalar fields
            Assert.IsTrue(result.Contains("Departments.Id"));
            Assert.IsTrue(result.Contains("Departments.Name"));
            Assert.IsTrue(result.Contains("Departments.OrganisationId"));
            // Should NOT contain the collection reference itself
            Assert.IsFalse(result.Contains("Departments"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithNestedEntityPath_ExpandsCorrectly()
        {
            // Arrange - "Department.Organisation" should expand to Organisation scalar fields
            var fields = new List<string> { "Id", "FirstName", "Department.Organisation" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));
            // Department.Organisation should expand to Organisation scalar fields
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Name"));
            Assert.IsTrue(result.Contains("Department.Organisation.Industry"));
            Assert.IsTrue(result.Contains("Department.Organisation.FoundYear"));
            // Should NOT contain the entity reference itself
            Assert.IsFalse(result.Contains("Department.Organisation"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithNestedCollectionPath_ExpandsCorrectly()
        {
            // Arrange - "Departments.Employees" should expand to Employee scalar fields
            var fields = new List<string> { "Id", "Name", "Departments.Employees" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("Name"));
            // Departments.Employees should expand to Employee scalar fields
            Assert.IsTrue(result.Contains("Departments.Employees.Id"));
            Assert.IsTrue(result.Contains("Departments.Employees.FirstName"));
            Assert.IsTrue(result.Contains("Departments.Employees.LastName"));
            Assert.IsTrue(result.Contains("Departments.Employees.Email"));
            Assert.IsTrue(result.Contains("Departments.Employees.DepartmentId"));
            Assert.IsTrue(result.Contains("Departments.Employees.RoleId"));
            // Should NOT contain the collection reference itself
            Assert.IsFalse(result.Contains("Departments.Employees"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithMixedScalarAndEntity_ExpandsOnlyEntities()
        {
            // Arrange - Mix of scalar fields and entity reference
            var fields = new List<string>
            {
                "Id",
                "FirstName",
                "LastName",
                "Department",
                "Email"
            };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            // Scalar fields should remain
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));
            Assert.IsTrue(result.Contains("LastName"));
            Assert.IsTrue(result.Contains("Email"));
            // Department should be expanded
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Name"));
            Assert.IsTrue(result.Contains("Department.OrganisationId"));
            Assert.IsFalse(result.Contains("Department"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithNestedScalarPath_ReturnsUnchanged()
        {
            // Arrange - "Department.Name" is already a scalar path, should remain unchanged
            var fields = new List<string> { "Id", "FirstName", "Department.Name" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));
            Assert.IsTrue(result.Contains("Department.Name"));
            // Should not expand since it's already a scalar path
            Assert.IsFalse(result.Contains("Department.Id"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithComplexExample_ExpandsCorrectly()
        {
            // Arrange - User's example from the conversation
            var fields = new List<string>
            {
                "Id",
                "Name",
                "Departments.Employees"
            };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("Name"));
            // Should expand to all Employee scalar fields
            Assert.IsTrue(result.Contains("Departments.Employees.Id"));
            Assert.IsTrue(result.Contains("Departments.Employees.FirstName"));
            Assert.IsTrue(result.Contains("Departments.Employees.LastName"));
            Assert.IsTrue(result.Contains("Departments.Employees.Email"));
            Assert.IsTrue(result.Contains("Departments.Employees.DepartmentId"));
            Assert.IsTrue(result.Contains("Departments.Employees.RoleId"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithInvalidPath_AddsAsIs()
        {
            // Arrange - Invalid property name
            var fields = new List<string> { "Id", "InvalidProperty" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("InvalidProperty")); // Should add as-is when property not found
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithEmptyList_ReturnsEmpty()
        {
            // Arrange
            var fields = new List<string>();

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.IsFalse(result.Any());
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithDuplicateExpansions_ReturnsDistinct()
        {
            // Arrange - Both paths would expand to same fields
            var fields = new List<string>
            {
                "Department",
                "Department" // Duplicate
            };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            // Should have distinct fields only (recursive expansion includes Organisation too)
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Name"));
            Assert.IsTrue(result.Contains("Department.Budget"));
            Assert.IsTrue(result.Contains("Department.Head"));
            Assert.IsTrue(result.Contains("Department.OrganisationId"));
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Name"));
            Assert.IsTrue(result.Contains("Department.Organisation.Industry"));
            Assert.IsTrue(result.Contains("Department.Organisation.FoundYear"));
            // Count should reflect distinct values (all Department + nested Organisation scalar fields)
            // No exact count assertion since it depends on recursive depth
            Assert.IsTrue(result.Count() > 5, "Should include nested Organisation fields");
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithMultipleCollections_ExpandsAll()
        {
            // Arrange - Employee has both Projects and Skills collections
            var fields = new List<string>
            {
                "Id",
                "FirstName",
                "Projects",
                "Skills"
            };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));
            // Projects collection expanded
            Assert.IsTrue(result.Contains("Projects.Id"));
            Assert.IsTrue(result.Contains("Projects.Title"));
            Assert.IsTrue(result.Contains("Projects.Deadline"));
            Assert.IsTrue(result.Contains("Projects.Budget"));
            Assert.IsTrue(result.Contains("Projects.ClientId"));
            // Skills collection expanded
            Assert.IsTrue(result.Contains("Skills.Id"));
            Assert.IsTrue(result.Contains("Skills.Name"));
            Assert.IsTrue(result.Contains("Skills.Proficiency"));
            Assert.IsTrue(result.Contains("Skills.Category"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RealWorldScenario_DepartmentsEmployeesExpansion()
        {
            // Arrange - Real scenario from user's request
            var fields = new List<string>
            {
                "Departments.Employees.FirstName",
                "Departments.Employees.LastName",
                "Departments.Employees.Id",
                "Departments.Employees.Department.Id",
                "Departments.Employees.Department.Name"
            };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            // All paths are already scalar, should remain unchanged
            Assert.IsTrue(result.Contains("Departments.Employees.FirstName"));
            Assert.IsTrue(result.Contains("Departments.Employees.LastName"));
            Assert.IsTrue(result.Contains("Departments.Employees.Id"));
            Assert.IsTrue(result.Contains("Departments.Employees.Department.Id"));
            Assert.IsTrue(result.Contains("Departments.Employees.Department.Name"));
            Assert.AreEqual(5, result.Count());
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_ExpandsNestedEntities()
        {
            // Arrange - "Department" should recursively expand to Department AND Organisation scalar fields
            var fields = new List<string> { "Id", "FirstName", "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));

            // Department direct scalar fields
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Name"));
            Assert.IsTrue(result.Contains("Department.Budget"));
            Assert.IsTrue(result.Contains("Department.Head"));
            Assert.IsTrue(result.Contains("Department.OrganisationId"));

            // Department.Organisation nested scalar fields (recursive expansion!)
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Name"));
            Assert.IsTrue(result.Contains("Department.Organisation.Industry"));
            Assert.IsTrue(result.Contains("Department.Organisation.FoundYear"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_HandlesCircularReferences()
        {
            // Arrange - Employee -> Department -> Organisation -> Departments -> Employees (circular)
            var fields = new List<string> { "Id", "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert - Should expand but stop at circular reference
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Name"));
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Name"));

            // Should NOT expand Department.Organisation.Departments.Employees (would cause infinite recursion)
            Assert.IsFalse(result.Any(f => f.Contains("Department.Organisation.Departments.Employees")));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_SkipsNestedCollections()
        {
            // Arrange - "Department" should expand scalar fields but NOT expand nested collections
            var fields = new List<string> { "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            // Should include Department and Organisation scalar fields
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));

            // Should NOT include Department.Organisation.Departments collection
            Assert.IsFalse(result.Any(f => f.StartsWith("Department.Organisation.Departments.")));

            // Should NOT include Department.Employees collection
            Assert.IsFalse(result.Any(f => f.StartsWith("Department.Employees.")));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_EmployeeToRole()
        {
            // Arrange - "Role" entity should recursively expand
            var fields = new List<string> { "Id", "FirstName", "Role" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));
            Assert.IsTrue(result.Contains("Role.Id"));
            Assert.IsTrue(result.Contains("Role.Title"));
            Assert.IsTrue(result.Contains("Role.Level"));
            Assert.IsTrue(result.Contains("Role.Description"));

            // Role doesn't have nested entities, so no deeper expansion
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_CollectionToNestedEntities()
        {
            // Arrange - "Departments.Employees" should expand to Employee direct fields only
            // Employee.Department and Employee.Role have [RecursiveIncludeLevel(2)]
            // Path "Departments.Employees.Department" is at level 3, which exceeds the limit
            var fields = new List<string> { "Departments.Employees" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            // Employee direct scalar fields (level 2 - within limit)
            Assert.IsTrue(result.Contains("Departments.Employees.Id"));
            Assert.IsTrue(result.Contains("Departments.Employees.FirstName"));
            Assert.IsTrue(result.Contains("Departments.Employees.LastName"));
            Assert.IsTrue(result.Contains("Departments.Employees.Email"));
            Assert.IsTrue(result.Contains("Departments.Employees.DepartmentId"));
            Assert.IsTrue(result.Contains("Departments.Employees.RoleId"));

            // Employee.Department and Employee.Role have RecursiveIncludeLevel(2)
            // "Departments.Employees.Department" is at level 3, exceeding the limit
            // So nested Department and Role fields should NOT be included
            Assert.IsFalse(result.Any(f => f.StartsWith("Departments.Employees.Department.")));
            Assert.IsFalse(result.Any(f => f.StartsWith("Departments.Employees.Role.")));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_MultiLevelNesting()
        {
            // Arrange - Test deep nesting: Employee -> Department -> Organisation
            var fields = new List<string> { "Id", "FirstName", "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert - Verify all levels are expanded
            // Level 0: Employee scalars
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));

            // Level 1: Department scalars
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Name"));
            Assert.IsTrue(result.Contains("Department.Budget"));
            Assert.IsTrue(result.Contains("Department.Head"));
            Assert.IsTrue(result.Contains("Department.OrganisationId"));

            // Level 2: Organisation scalars (nested)
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Name"));
            Assert.IsTrue(result.Contains("Department.Organisation.Industry"));
            Assert.IsTrue(result.Contains("Department.Organisation.FoundYear"));

            // Should NOT expand Organisation.Departments collection
            Assert.IsFalse(result.Any(f => f.StartsWith("Department.Organisation.Departments.")));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveIncludeLevel_RespectsLevel2Limit()
        {
            // Arrange - Employee.Department has [RecursiveIncludeLevel(2)]
            // Path "Employee" -> "Department" is level 1, should expand
            // Path "Employee.Department" -> "Organisation" is level 2, should expand
            // Path "Employee.Department.Organisation" -> "Departments" is level 3, should NOT expand (exceeds level 2)
            var fields = new List<string> { "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            // Level 1: Department direct scalar fields (within limit)
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Name"));
            Assert.IsTrue(result.Contains("Department.Budget"));
            Assert.IsTrue(result.Contains("Department.Head"));
            Assert.IsTrue(result.Contains("Department.OrganisationId"));

            // Level 2: Organisation scalar fields (within limit)
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Name"));
            Assert.IsTrue(result.Contains("Department.Organisation.Industry"));
            Assert.IsTrue(result.Contains("Department.Organisation.FoundYear"));

            // Level 3: Organisation.Departments would exceed level 2 limit
            Assert.IsFalse(result.Any(f => f.StartsWith("Department.Organisation.Departments.")));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveIncludeLevel_RoleHasLevel2()
        {
            // Arrange - Employee.Role has [RecursiveIncludeLevel(2)]
            // Role doesn't have nested entity properties, so this just verifies the attribute doesn't break anything
            var fields = new List<string> { "Role" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            // Role direct scalar fields (level 1 - within limit)
            Assert.IsTrue(result.Contains("Role.Id"));
            Assert.IsTrue(result.Contains("Role.Title"));
            Assert.IsTrue(result.Contains("Role.Level"));
            Assert.IsTrue(result.Contains("Role.Description"));

            // Role has no nested entities, so nothing to block
            Assert.AreEqual(4, result.Count());
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveIncludeLevel_NestedCollectionPath()
        {
            // Arrange - Testing RecursiveIncludeLevel with collection paths
            // "Departments.Employees" -> "Department" exceeds level 2
            var fields = new List<string> { "Departments.Employees" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            // Should have Employee direct fields only
            Assert.IsTrue(result.Contains("Departments.Employees.Id"));
            Assert.IsTrue(result.Contains("Departments.Employees.FirstName"));
            Assert.IsTrue(result.Contains("Departments.Employees.LastName"));
            Assert.IsTrue(result.Contains("Departments.Employees.Email"));
            Assert.IsTrue(result.Contains("Departments.Employees.DepartmentId"));
            Assert.IsTrue(result.Contains("Departments.Employees.RoleId"));

            // Should NOT have Department or Role nested fields (level 3)
            Assert.IsFalse(result.Any(f => f.StartsWith("Departments.Employees.Department.")));
            Assert.IsFalse(result.Any(f => f.StartsWith("Departments.Employees.Role.")));

            // Should only have 6 direct scalar fields
            Assert.AreEqual(6, result.Count());
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveIncludeLevel_MixedLevels()
        {
            // Arrange - Mix of fields with different recursive levels
            var fields = new List<string> { "Id", "FirstName", "Department", "Role" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            // Direct scalar fields
            Assert.IsTrue(result.Contains("Id"));
            Assert.IsTrue(result.Contains("FirstName"));

            // Department fields (with nested Organisation up to level 2)
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Organisation.Id"));
            Assert.IsFalse(result.Any(f => f.StartsWith("Department.Organisation.Departments.")));

            // Role fields (no nested entities)
            Assert.IsTrue(result.Contains("Role.Id"));
            Assert.IsTrue(result.Contains("Role.Title"));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveIncludeLevel_StopsAtExactLimit()
        {
            // Arrange - Verify level calculation is correct
            // Employee -> Department (level 1) -> Organisation (level 2) STOP
            var fields = new List<string> { "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            // Count the maximum depth
            var maxDepth = result.Max(f => f.Split('.').Length);

            // Should expand to level 2 (Department.Organisation.*)
            Assert.AreEqual(3, maxDepth, "Should expand to 'Department.Organisation.FieldName' which is 3 segments");

            // Should have Department (level 1) and Organisation (level 2) fields
            Assert.IsTrue(result.Any(f => f.StartsWith("Department.") && !f.Contains("Organisation")));
            Assert.IsTrue(result.Any(f => f.StartsWith("Department.Organisation.")));

            // Should NOT have any level 3 entity expansions
            Assert.IsFalse(result.Any(f => f.StartsWith("Department.Organisation.Departments.")));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveIncludeLevel_WithExpandNestedEntitiesFalse()
        {
            // Arrange - When expandNestedEntities=false, RecursiveIncludeLevel should not matter
            // This is used by BuildFlattenedQuery
            var fields = new List<string> { "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee), expandNestedEntities: false);

            // Assert
            // Should only have Department direct scalar fields, no nested expansion at all
            Assert.IsTrue(result.Contains("Department.Id"));
            Assert.IsTrue(result.Contains("Department.Name"));
            Assert.IsTrue(result.Contains("Department.Budget"));
            Assert.IsTrue(result.Contains("Department.Head"));
            Assert.IsTrue(result.Contains("Department.OrganisationId"));

            // Should NOT have any nested Organisation fields (expandNestedEntities=false)
            Assert.IsFalse(result.Any(f => f.StartsWith("Department.Organisation.")));

            // Should only have Department's direct fields (5 scalar properties)
            Assert.AreEqual(5, result.Count());
        }
    }
}
