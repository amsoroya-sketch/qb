using Microsoft.VisualStudio.TestTools.UnitTesting;
using FluentAssertions;
using QueryBuilderDemo.Models;
using PbsApi.Utils;
using System.Linq;

namespace QueryBuilderDemo.Tests.QueryBuilderTests
{
    [TestClass]
    public class SplitIncludesTests
    {
        [TestMethod]
        public void SplitIncludes_WithScalarProperty_OnlyInSelectors()
        {
            // Arrange
            var includes = new HashSet<string> { "Name" };

            // Act
            QueryBuilder.SplitIncludes<Organisation>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            validIncludes.Should().NotContain("Name"); // Scalar not in includes
            selectorPaths.Should().Contain("Name");
        }

        [TestMethod]
        public void SplitIncludes_WithNavigationDotScalar_SplitsCorrectly()
        {
            // Arrange
            var includes = new HashSet<string> { "Department.Name" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            validIncludes.Should().Contain("Department");
            selectorPaths.Should().Contain("Department.Name");
        }

        [TestMethod]
        public void SplitIncludes_WithMultiplePaths_HandlesAll()
        {
            // Arrange
            var includes = new HashSet<string>
            {
                "Department",
                "Role",
                "Projects",
                "Skills"
            };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            validIncludes.Should().Contain("Department");
            validIncludes.Should().Contain("Role");
            validIncludes.Should().Contain("Projects");
            validIncludes.Should().Contain("Skills");
            validIncludes.Should().HaveCount(4);
        }

        [TestMethod]
        public void SplitIncludes_WithRedundantPaths_RemovesRedundancy()
        {
            // Arrange
            var includes = new HashSet<string>
            {
                "Departments",
                "Departments.Employees",
                "Departments.Employees.Role"
            };

            // Act
            QueryBuilder.SplitIncludes<Organisation>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            // Should remove shorter paths that are covered by longer ones
            validIncludes.Should().NotContain("Departments"); // Covered by longer paths
            validIncludes.Should().NotContain("Departments.Employees"); // Covered by longer path
            validIncludes.Should().Contain("Departments.Employees.Role");
        }

        [TestMethod]
        public void SplitIncludes_WithWildcard_ExpandsAllNavigations()
        {
            // Arrange
            var includes = new HashSet<string> { "*" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            validIncludes.Should().Contain("Department");
            validIncludes.Should().Contain("Role");
            validIncludes.Should().Contain("Projects");
            validIncludes.Should().Contain("Skills");
            selectorPaths.Should().NotBeEmpty();
        }

        [TestMethod]
        public void SplitIncludes_WithEmptySet_ReturnsEmptySets()
        {
            // Arrange
            var includes = new HashSet<string>();

            // Act
            QueryBuilder.SplitIncludes<Organisation>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            validIncludes.Should().BeEmpty();
            selectorPaths.Should().BeEmpty();
        }

        [TestMethod]
        public void SplitIncludes_WithWhitespaceStrings_IgnoresThem()
        {
            // Arrange
            var includes = new HashSet<string> { "Departments", "  ", "" };

            // Act
            QueryBuilder.SplitIncludes<Organisation>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            validIncludes.Should().Contain("Departments");
            validIncludes.Should().HaveCount(1);
        }

        [TestMethod]
        public void SplitIncludes_WithManyToManyPath_HandlesCorrectly()
        {
            // Arrange
            var includes = new HashSet<string> { "Projects", "Skills" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            validIncludes.Should().Contain("Projects");
            validIncludes.Should().Contain("Skills");
        }

        [TestMethod]
        public void SplitIncludes_CaseInsensitive_HandlesCorrectly()
        {
            // Arrange
            var includes = new HashSet<string> { "departments" }; // lowercase

            // Act
            QueryBuilder.SplitIncludes<Organisation>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            // Should handle case insensitivity
            validIncludes.Should().Contain("Departments");
        }

        [TestMethod]
        public void SplitIncludes_WithInvalidPropertyName_DoesNotCrash()
        {
            // Arrange
            var includes = new HashSet<string> { "InvalidProperty" };

            // Act
            QueryBuilder.SplitIncludes<Organisation>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            // Should handle gracefully
            validIncludes.Should().BeEmpty();
            selectorPaths.Should().BeEmpty();
        }
    }
}
