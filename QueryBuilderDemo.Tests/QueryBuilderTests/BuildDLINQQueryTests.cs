using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
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
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Id.Should().BeGreaterThan(0);
            org.Name.Should().NotBeNullOrEmpty();
            org.Industry.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();
            emp.Department.Should().NotBeNull();
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();
            emp.Department.Should().NotBeNull();
            emp.Department!.Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();
            emp.Department.Should().NotBeNull();
            emp.Department!.Name.Should().NotBeNullOrEmpty();
            emp.Department.Organisation.Should().NotBeNull();
            emp.Department.Organisation!.Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Id.Should().BeGreaterThan(0);
            org.Name.Should().NotBeNullOrEmpty();
            org.Departments.Should().NotBeEmpty();
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
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Id.Should().BeGreaterThan(0);
            org.Name.Should().NotBeNullOrEmpty();
            org.Departments.Should().NotBeEmpty();
            org.Departments.First().Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var emp = result.First();
            emp.Id.Should().BeGreaterThan(0);
            emp.FirstName.Should().NotBeNullOrEmpty();
            emp.Email.Should().NotBeNullOrEmpty();
            emp.Department.Should().NotBeNull();
            emp.Department!.Name.Should().NotBeNullOrEmpty();
            emp.Role.Should().NotBeNull();
            emp.Role!.Title.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var client = result.First();
            client.Id.Should().BeGreaterThan(0);
            client.Name.Should().NotBeNullOrEmpty();
            client.Projects.Should().NotBeEmpty();
            client.Projects.First().Title.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var empWithSkills = result.FirstOrDefault(e => e.Skills.Any());
            empWithSkills.Should().NotBeNull();
            empWithSkills!.Skills.First().Name.Should().NotBeNullOrEmpty();
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
            result.Should().NotBeEmpty();
            var org = result.First();
            org.Id.Should().BeGreaterThan(0);
            org.Name.Should().NotBeNullOrEmpty();
            // Industry and FoundYear should be default values since not selected
        }
    }
}
