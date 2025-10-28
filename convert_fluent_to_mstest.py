#!/usr/bin/env python3
"""Convert FluentAssertions to MSTest assertions"""

import re
import sys

def convert_assertions(content):
    """Convert FluentAssertions syntax to MSTest"""

    # Pattern 1: .Should().NotBeNull("message") → Assert.IsNotNull(variable, "message")
    content = re.sub(
        r'(\w+)\.Should\(\)\.NotBeNull\(([^)]*)\)',
        r'Assert.IsNotNull(\1, \2)',
        content
    )

    # Pattern 2: .GetArrayLength().Should().BeGreaterThan(0) → Assert.IsTrue(.GetArrayLength() > 0)
    content = re.sub(
        r'(.+?)\.Should\(\)\.BeGreaterThan\((\d+)\)',
        r'Assert.IsTrue(\1 > \2)',
        content
    )

    # Pattern 3: .Should().NotBeEmpty() → Assert.IsTrue(.Count > 0) or Assert.IsTrue(.Any())
    content = re.sub(
        r'(\w+)\.Should\(\)\.NotBeEmpty\(\)',
        r'Assert.IsTrue(\1.Count > 0)',
        content
    )

    # Pattern 4: .Should().Be(expected, "message") → Assert.AreEqual(expected, actual, "message")
    content = re.sub(
        r'(\w+(?:\[i\])?(?:\.\w+)*)\.Should\(\)\.Be\(([^,]+),\s*([^)]+)\)',
        r'Assert.AreEqual(\2, \1, \3)',
        content
    )

    # Pattern 5: .Should().NotBe(value, "message") → Assert.AreNotEqual(value, actual, "message")
    content = re.sub(
        r'(\w+)\.Should\(\)\.NotBe\(([^,]+),\s*([^)]+)\)',
        r'Assert.AreNotEqual(\2, \1, \3)',
        content
    )

    # Pattern 6: .Should().Equal(expected, "message") → CollectionAssert.AreEqual(expected, actual, "message")
    content = re.sub(
        r'(\w+)\.Should\(\)\.Equal\(([^,]+),\s*([^)]+)\)',
        r'CollectionAssert.AreEqual(\2, \1, \3)',
        content
    )

    # Pattern 7: .Should().BeOnOrAfter(date, "message") → Assert.IsTrue(actual >= date, "message")
    content = re.sub(
        r'(\w+)\.Should\(\)\.BeOnOrAfter\(([^,]+),\s*([^)]+)\)',
        r'Assert.IsTrue(\1 >= \2, \3)',
        content
    )

    # Pattern 8: .Should().BeTrue() → Assert.IsTrue()
    content = re.sub(
        r'(.+?)\.Should\(\)\.BeTrue\(\)',
        r'Assert.IsTrue(\1)',
        content
    )

    return content

def main():
    filepath = '/home/dev/Development/qb/QueryBuilderDemo.Tests/QueryBuilderTests/HierarchicalOrderingAndFilteringTests.cs'

    with open(filepath, 'r') as f:
        content = f.read()

    converted = convert_assertions(content)

    with open(filepath, 'w') as f:
        f.write(converted)

    print(f"Converted assertions in {filepath}")

if __name__ == '__main__':
    main()
