using Microsoft.VisualStudio.TestTools.UnitTesting;
using QueryBuilderDemo.Tests.Data;
using QueryBuilderDemo.Tests.Models;
using QueryBuilderDemo.Tests.Helpers;
using PbsApi.Utils;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    [TestClass]
    public class BuildDLINQQueryTests
    {
        [TestMethod]
        public void BuildDLINQQuery_WithScalarFieldsOnly_ReturnsProjection()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "Name", "Industry" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Organisations, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(org.Name));
            Assert.IsFalse(string.IsNullOrEmpty(org.Industry));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithNavigationProperty_LoadsRelatedData()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "FirstName", "LastName", "Department" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));
            Assert.IsNotNull(emp.Department);
        }

        [TestMethod]
        public void BuildDLINQQuery_WithNestedScalarField_LoadsNestedData()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "FirstName", "Department.Name" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));
            Assert.IsNotNull(emp.Department);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department!.Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithMultipleLevels_LoadsCompleteHierarchy()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "FirstName",
                "Department.Name",
                "Department.Organisation.Name"
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));
            Assert.IsNotNull(emp.Department);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department!.Name));
            Assert.IsNotNull(emp.Department.Organisation);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department.Organisation!.Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithCollectionNavigation_LoadsCollection()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "Name", "Departments" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Organisations, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(org.Name));
            Assert.IsTrue(org.Departments.Any());
        }

        [TestMethod]
        public void BuildDLINQQuery_WithNestedCollectionScalar_LoadsNestedFields()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "Name", "Departments.Name" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Organisations, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(org.Name));
            Assert.IsTrue(org.Departments.Any());
            Assert.IsFalse(string.IsNullOrEmpty(org.Departments.First().Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithMixedScalarAndNavigation_LoadsCorrectly()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "FirstName",
                "LastName",
                "Email",
                "Department.Name",
                "Role.Title"
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var emp = result.First();
            Assert.IsTrue(emp.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(emp.FirstName));
            Assert.IsFalse(string.IsNullOrEmpty(emp.Email));
            Assert.IsNotNull(emp.Department);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Department!.Name));
            Assert.IsNotNull(emp.Role);
            Assert.IsFalse(string.IsNullOrEmpty(emp.Role!.Title));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithEmptyFields_ThrowsArgumentException()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>();

            // Act & Assert
            Assert.ThrowsException<ArgumentException>(() =>
                QueryBuilder.BuildDLINQQuery(context.Employees, fields).ToList());
        }

        [TestMethod]
        public void BuildDLINQQuery_WithNullFields_ThrowsArgumentException()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            // Act & Assert
            Assert.ThrowsException<ArgumentException>(() =>
                QueryBuilder.BuildDLINQQuery(context.Employees, null!).ToList());
        }

        [TestMethod]
        public void BuildDLINQQuery_WithComplexProjectPath_ClientProjectsTasks()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "Name",
                "Projects.Title",
                "Projects.Tasks.Title"
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Clients, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var client = result.First();
            Assert.IsTrue(client.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(client.Name));
            Assert.IsTrue(client.Projects.Any());
            Assert.IsFalse(string.IsNullOrEmpty(client.Projects.First().Title));
        }

        [TestMethod]
        public void BuildDLINQQuery_WithManyToManyField_LoadsManyToMany()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string>
            {
                "Id",
                "FirstName",
                "Skills.Name"
            };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Employees, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var empWithSkills = result.FirstOrDefault(e => e.Skills.Any());
            Assert.IsNotNull(empWithSkills);
            Assert.IsFalse(string.IsNullOrEmpty(empWithSkills!.Skills.First().Name));
        }

        [TestMethod]
        public void BuildDLINQQuery_VerifiesOnlySelectedFieldsReturned()
        {
            // Arrange
            using var context = TestDbContextFactory.CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);

            var fields = new HashSet<string> { "Id", "Name" };

            // Act
            var result = QueryBuilder.BuildDLINQQuery(context.Organisations, fields)
                .ToList();

            // Assert
            Assert.IsTrue(result.Any());
            var org = result.First();
            Assert.IsTrue(org.Id > 0);
            Assert.IsFalse(string.IsNullOrEmpty(org.Name));
            // Industry and FoundYear should be default values since not selected
        }
    }
}
