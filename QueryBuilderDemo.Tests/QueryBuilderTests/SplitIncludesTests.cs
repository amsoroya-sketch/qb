using Microsoft.VisualStudio.TestTools.UnitTesting;
using QueryBuilderDemo.Tests.Models;
using PbsApi.Utils;
using System.Collections.Generic;
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
            Assert.IsFalse(validIncludes.Contains("Name")); // Scalar not in includes
            Assert.IsTrue(selectorPaths.Contains("Name"));
        }

        [TestMethod]
        public void SplitIncludes_WithNavigationDotScalar_SplitsCorrectly()
        {
            // Arrange
            var includes = new HashSet<string> { "Department.Name" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            Assert.IsTrue(validIncludes.Contains("Department"));
            Assert.IsTrue(selectorPaths.Contains("Department.Name"));
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
            Assert.IsTrue(validIncludes.Contains("Department"));
            Assert.IsTrue(validIncludes.Contains("Role"));
            Assert.IsTrue(validIncludes.Contains("Projects"));
            Assert.IsTrue(validIncludes.Contains("Skills"));
            Assert.AreEqual(4, validIncludes.Count());
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
            Assert.IsFalse(validIncludes.Contains("Departments")); // Covered by longer paths
            Assert.IsFalse(validIncludes.Contains("Departments.Employees")); // Covered by longer path
            Assert.IsTrue(validIncludes.Contains("Departments.Employees.Role"));
        }

        [TestMethod]
        public void SplitIncludes_WithWildcard_ExpandsAllNavigations()
        {
            // Arrange
            var includes = new HashSet<string> { "*" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            Assert.IsTrue(validIncludes.Contains("Department"));
            Assert.IsTrue(validIncludes.Contains("Role"));
            Assert.IsTrue(validIncludes.Contains("Projects"));
            Assert.IsTrue(validIncludes.Contains("Skills"));
            Assert.IsTrue(selectorPaths.Any());
        }

        [TestMethod]
        public void SplitIncludes_WithEmptySet_ReturnsEmptySets()
        {
            // Arrange
            var includes = new HashSet<string>();

            // Act
            QueryBuilder.SplitIncludes<Organisation>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            Assert.IsFalse(validIncludes.Any());
            Assert.IsFalse(selectorPaths.Any());
        }

        [TestMethod]
        public void SplitIncludes_WithWhitespaceStrings_IgnoresThem()
        {
            // Arrange
            var includes = new HashSet<string> { "Departments", "  ", "" };

            // Act
            QueryBuilder.SplitIncludes<Organisation>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            Assert.IsTrue(validIncludes.Contains("Departments"));
            Assert.AreEqual(1, validIncludes.Count());
        }

        [TestMethod]
        public void SplitIncludes_WithManyToManyPath_HandlesCorrectly()
        {
            // Arrange
            var includes = new HashSet<string> { "Projects", "Skills" };

            // Act
            QueryBuilder.SplitIncludes<Employee>(includes, out var validIncludes, out var selectorPaths);

            // Assert
            Assert.IsTrue(validIncludes.Contains("Projects"));
            Assert.IsTrue(validIncludes.Contains("Skills"));
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
            Assert.IsTrue(validIncludes.Contains("Departments"));
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
            Assert.IsFalse(validIncludes.Any());
            Assert.IsFalse(selectorPaths.Any());
        }
    }
}
