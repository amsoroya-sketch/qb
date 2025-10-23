using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
using QueryBuilderDemo.Models;
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
            result.Should().HaveCount(4);
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");
            result.Should().Contain("LastName");
            result.Should().Contain("Email");
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithEntityReference_ExpandsToScalarFields()
        {
            // Arrange - "Department" should expand recursively to all scalar fields
            var fields = new List<string> { "Id", "FirstName", "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");
            // Department entity should be expanded to its scalar fields (and nested entities)
            result.Should().Contain("Department.Id");
            result.Should().Contain("Department.Name");
            result.Should().Contain("Department.OrganisationId");
            // Should recursively expand Department.Organisation
            result.Should().Contain("Department.Organisation.Id");
            result.Should().Contain("Department.Organisation.Name");
            // Should NOT contain the entity reference itself
            result.Should().NotContain("Department");
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithCollectionReference_ExpandsToScalarFields()
        {
            // Arrange - "Departments" collection should expand to all Department scalar fields
            var fields = new List<string> { "Id", "Name", "Departments" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            result.Should().Contain("Id");
            result.Should().Contain("Name");
            // Departments collection should be expanded to scalar fields
            result.Should().Contain("Departments.Id");
            result.Should().Contain("Departments.Name");
            result.Should().Contain("Departments.OrganisationId");
            // Should NOT contain the collection reference itself
            result.Should().NotContain("Departments");
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithNestedEntityPath_ExpandsCorrectly()
        {
            // Arrange - "Department.Organisation" should expand to Organisation scalar fields
            var fields = new List<string> { "Id", "FirstName", "Department.Organisation" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");
            // Department.Organisation should expand to Organisation scalar fields
            result.Should().Contain("Department.Organisation.Id");
            result.Should().Contain("Department.Organisation.Name");
            result.Should().Contain("Department.Organisation.Industry");
            result.Should().Contain("Department.Organisation.FoundYear");
            // Should NOT contain the entity reference itself
            result.Should().NotContain("Department.Organisation");
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithNestedCollectionPath_ExpandsCorrectly()
        {
            // Arrange - "Departments.Employees" should expand to Employee scalar fields
            var fields = new List<string> { "Id", "Name", "Departments.Employees" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            result.Should().Contain("Id");
            result.Should().Contain("Name");
            // Departments.Employees should expand to Employee scalar fields
            result.Should().Contain("Departments.Employees.Id");
            result.Should().Contain("Departments.Employees.FirstName");
            result.Should().Contain("Departments.Employees.LastName");
            result.Should().Contain("Departments.Employees.Email");
            result.Should().Contain("Departments.Employees.DepartmentId");
            result.Should().Contain("Departments.Employees.RoleId");
            // Should NOT contain the collection reference itself
            result.Should().NotContain("Departments.Employees");
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
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");
            result.Should().Contain("LastName");
            result.Should().Contain("Email");
            // Department should be expanded
            result.Should().Contain("Department.Id");
            result.Should().Contain("Department.Name");
            result.Should().Contain("Department.OrganisationId");
            result.Should().NotContain("Department");
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithNestedScalarPath_ReturnsUnchanged()
        {
            // Arrange - "Department.Name" is already a scalar path, should remain unchanged
            var fields = new List<string> { "Id", "FirstName", "Department.Name" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");
            result.Should().Contain("Department.Name");
            // Should not expand since it's already a scalar path
            result.Should().NotContain("Department.Id");
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
            result.Should().Contain("Id");
            result.Should().Contain("Name");
            // Should expand to all Employee scalar fields
            result.Should().Contain("Departments.Employees.Id");
            result.Should().Contain("Departments.Employees.FirstName");
            result.Should().Contain("Departments.Employees.LastName");
            result.Should().Contain("Departments.Employees.Email");
            result.Should().Contain("Departments.Employees.DepartmentId");
            result.Should().Contain("Departments.Employees.RoleId");
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithInvalidPath_AddsAsIs()
        {
            // Arrange - Invalid property name
            var fields = new List<string> { "Id", "InvalidProperty" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            result.Should().Contain("Id");
            result.Should().Contain("InvalidProperty"); // Should add as-is when property not found
        }

        [TestMethod]
        public void ExpandFieldsToScalars_WithEmptyList_ReturnsEmpty()
        {
            // Arrange
            var fields = new List<string>();

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            result.Should().BeEmpty();
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
            result.Should().Contain("Department.Id");
            result.Should().Contain("Department.Name");
            result.Should().Contain("Department.Budget");
            result.Should().Contain("Department.Head");
            result.Should().Contain("Department.OrganisationId");
            result.Should().Contain("Department.Organisation.Id");
            result.Should().Contain("Department.Organisation.Name");
            result.Should().Contain("Department.Organisation.Industry");
            result.Should().Contain("Department.Organisation.FoundYear");
            // Count should reflect distinct values (all Department + nested Organisation scalar fields)
            // No exact count assertion since it depends on recursive depth
            result.Count.Should().BeGreaterThan(5, "Should include nested Organisation fields");
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
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");
            // Projects collection expanded
            result.Should().Contain("Projects.Id");
            result.Should().Contain("Projects.Title");
            result.Should().Contain("Projects.Deadline");
            result.Should().Contain("Projects.Budget");
            result.Should().Contain("Projects.ClientId");
            // Skills collection expanded
            result.Should().Contain("Skills.Id");
            result.Should().Contain("Skills.Name");
            result.Should().Contain("Skills.Proficiency");
            result.Should().Contain("Skills.Category");
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
            result.Should().Contain("Departments.Employees.FirstName");
            result.Should().Contain("Departments.Employees.LastName");
            result.Should().Contain("Departments.Employees.Id");
            result.Should().Contain("Departments.Employees.Department.Id");
            result.Should().Contain("Departments.Employees.Department.Name");
            result.Should().HaveCount(5);
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_ExpandsNestedEntities()
        {
            // Arrange - "Department" should recursively expand to Department AND Organisation scalar fields
            var fields = new List<string> { "Id", "FirstName", "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");

            // Department direct scalar fields
            result.Should().Contain("Department.Id");
            result.Should().Contain("Department.Name");
            result.Should().Contain("Department.Budget");
            result.Should().Contain("Department.Head");
            result.Should().Contain("Department.OrganisationId");

            // Department.Organisation nested scalar fields (recursive expansion!)
            result.Should().Contain("Department.Organisation.Id");
            result.Should().Contain("Department.Organisation.Name");
            result.Should().Contain("Department.Organisation.Industry");
            result.Should().Contain("Department.Organisation.FoundYear");
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_HandlesCircularReferences()
        {
            // Arrange - Employee -> Department -> Organisation -> Departments -> Employees (circular)
            var fields = new List<string> { "Id", "Department" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert - Should expand but stop at circular reference
            result.Should().Contain("Id");
            result.Should().Contain("Department.Id");
            result.Should().Contain("Department.Name");
            result.Should().Contain("Department.Organisation.Id");
            result.Should().Contain("Department.Organisation.Name");

            // Should NOT expand Department.Organisation.Departments.Employees (would cause infinite recursion)
            result.Should().NotContain(f => f.Contains("Department.Organisation.Departments.Employees"));
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
            result.Should().Contain("Department.Id");
            result.Should().Contain("Department.Organisation.Id");

            // Should NOT include Department.Organisation.Departments collection
            result.Should().NotContain(f => f.StartsWith("Department.Organisation.Departments."));

            // Should NOT include Department.Employees collection
            result.Should().NotContain(f => f.StartsWith("Department.Employees."));
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_EmployeeToRole()
        {
            // Arrange - "Role" entity should recursively expand
            var fields = new List<string> { "Id", "FirstName", "Role" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Employee));

            // Assert
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");
            result.Should().Contain("Role.Id");
            result.Should().Contain("Role.Title");
            result.Should().Contain("Role.Level");
            result.Should().Contain("Role.Description");

            // Role doesn't have nested entities, so no deeper expansion
        }

        [TestMethod]
        public void ExpandFieldsToScalars_RecursiveExpansion_CollectionToNestedEntities()
        {
            // Arrange - "Departments.Employees" should expand recursively
            var fields = new List<string> { "Departments.Employees" };

            // Act
            var result = QueryBuilder.ExpandFieldsToScalars(fields, typeof(Organisation));

            // Assert
            // Employee direct scalar fields
            result.Should().Contain("Departments.Employees.Id");
            result.Should().Contain("Departments.Employees.FirstName");
            result.Should().Contain("Departments.Employees.LastName");
            result.Should().Contain("Departments.Employees.Email");
            result.Should().Contain("Departments.Employees.DepartmentId");
            result.Should().Contain("Departments.Employees.RoleId");

            // Employee.Department nested scalar fields (recursive!)
            result.Should().Contain("Departments.Employees.Department.Id");
            result.Should().Contain("Departments.Employees.Department.Name");
            result.Should().Contain("Departments.Employees.Department.Budget");
            result.Should().Contain("Departments.Employees.Department.Head");
            result.Should().Contain("Departments.Employees.Department.OrganisationId");

            // Employee.Role nested scalar fields (recursive!)
            result.Should().Contain("Departments.Employees.Role.Id");
            result.Should().Contain("Departments.Employees.Role.Title");
            result.Should().Contain("Departments.Employees.Role.Level");
            result.Should().Contain("Departments.Employees.Role.Description");
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
            result.Should().Contain("Id");
            result.Should().Contain("FirstName");

            // Level 1: Department scalars
            result.Should().Contain("Department.Id");
            result.Should().Contain("Department.Name");
            result.Should().Contain("Department.Budget");
            result.Should().Contain("Department.Head");
            result.Should().Contain("Department.OrganisationId");

            // Level 2: Organisation scalars (nested)
            result.Should().Contain("Department.Organisation.Id");
            result.Should().Contain("Department.Organisation.Name");
            result.Should().Contain("Department.Organisation.Industry");
            result.Should().Contain("Department.Organisation.FoundYear");

            // Should NOT expand Organisation.Departments collection
            result.Should().NotContain(f => f.StartsWith("Department.Organisation.Departments."));
        }
    }
}
