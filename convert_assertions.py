#!/usr/bin/env python3
import re
import sys

def convert_assertions(content):
    """Convert FluentAssertions to MSTest assertions"""

    # Remove FluentAssertions using statement
    content = re.sub(r'using FluentAssertions;\n', '', content)

    # Collections
    content = re.sub(r'(\w+)\.Should\(\)\.NotBeEmpty\(\)', r'Assert.IsTrue(\1.Any())', content)
    content = re.sub(r'(\w+)\.Should\(\)\.BeEmpty\(\)', r'Assert.IsFalse(\1.Any())', content)
    content = re.sub(r'(\w+)\.Should\(\)\.HaveCount\((\d+)\)', r'Assert.AreEqual(\2, \1.Count())', content)
    content = re.sub(r'(\w+)\.Should\(\)\.HaveCountGreaterThan\((\d+)\)', r'Assert.IsTrue(\1.Count() > \2)', content)
    content = re.sub(r'(\w+)\.Should\(\)\.Contain\(([^)]+)\)', r'Assert.IsTrue(\1.Contains(\2))', content)
    content = re.sub(r'(\w+)\.Should\(\)\.NotContain\(([^)]+)\)', r'Assert.IsFalse(\1.Contains(\2))', content)
    content = re.sub(r'(\w+)\.Should\(\)\.OnlyContain\(([^)]+)\)', r'Assert.IsTrue(\1.All(\2))', content)
    content = re.sub(r'(\w+)\.Should\(\)\.Equal\(([^)]+)\)', r'CollectionAssert.AreEqual(\2.ToList(), \1.ToList())', content)

    # Null checks
    content = re.sub(r'(\w+)\.Should\(\)\.NotBeNull\(\)', r'Assert.IsNotNull(\1)', content)
    content = re.sub(r'(\w+)\.Should\(\)\.BeNull\(\)', r'Assert.IsNull(\1)', content)

    # Strings
    content = re.sub(r'(\w+)\.Should\(\)\.NotBeNullOrEmpty\(\)', r'Assert.IsFalse(string.IsNullOrEmpty(\1))', content)

    # Booleans
    content = re.sub(r'(\w+)\.Should\(\)\.BeTrue\(\)', r'Assert.IsTrue(\1)', content)
    content = re.sub(r'(\w+)\.Should\(\)\.BeFalse\(\)', r'Assert.IsFalse(\1)', content)

    # Numeric comparisons
    content = re.sub(r'(\w+)\.Should\(\)\.BeGreaterThan\(([^)]+)\)', r'Assert.IsTrue(\1 > \2)', content)
    content = re.sub(r'(\w+)\.Should\(\)\.Be\(([^)]+)\)', r'Assert.AreEqual(\2, \1)', content)

    # With messages
    content = re.sub(r'(\w+)\.Should\(\)\.Be\(([^,]+),\s*([^)]+)\)', r'Assert.AreEqual(\2, \1, \3)', content)
    content = re.sub(r'(\w+)\.Should\(\)\.NotBeNull\(([^)]+)\)', r'Assert.IsNotNull(\1, \2)', content)
    content = re.sub(r'(\w+)\.Should\(\)\.OnlyContain\(([^,]+),\s*([^)]+)\)', r'Assert.IsTrue(\1.All(\2), \3)', content)
    content = re.sub(r'(\w+)\.Should\(\)\.NotContain\(([^,]+),\s*([^)]+)\)', r'Assert.IsFalse(\1.Contains(\2), \3)', content)
    content = re.sub(r'(\w+)\.Should\(\)\.Equal\(([^,]+),\s*([^)]+)\)', r'CollectionAssert.AreEqual(\2.ToList(), \1.ToList(), \3)', content)

    return content

if __name__ == '__main__':
    file_path = sys.argv[1]
    with open(file_path, 'r') as f:
        content = f.read()

    converted = convert_assertions(content)

    with open(file_path, 'w') as f:
        f.write(converted)

    print(f"Converted {file_path}")
