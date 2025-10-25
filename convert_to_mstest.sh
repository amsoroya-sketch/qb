#!/bin/bash

convert_file() {
    local file="$1"
    echo "Converting $file..."

    # Remove using FluentAssertions;
    sed -i '/using FluentAssertions;/d' "$file"

    # Simple replacements - MUST be done in correct order to avoid breaking intermediate states

    # Preserve lambdas in Should().Contain(x => ...) and Should().OnlyContain(x => ...)
    # We need to handle these specially

    # Handle .Should().NotBeEmpty() -> Assert.IsTrue(x.Any())
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.NotBeEmpty()/Assert.IsTrue(\1.Any())/g' "$file"

    # Handle .Should().BeEmpty() -> Assert.IsFalse(x.Any())
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.BeEmpty()/Assert.IsFalse(\1.Any())/g' "$file"

    # Handle .Should().NotBeNull() -> Assert.IsNotNull(x)
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.NotBeNull()/Assert.IsNotNull(\1)/g' "$file"

    # Handle .Should().BeNull() -> Assert.IsNull(x)
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.BeNull()/Assert.IsNull(\1)/g' "$file"

    # Handle .Should().NotBeNullOrEmpty() -> Assert.IsFalse(string.IsNullOrEmpty(x))
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.NotBeNullOrEmpty()/Assert.IsFalse(string.IsNullOrEmpty(\1))/g' "$file"

    # Handle .Should().BeTrue() -> Assert.IsTrue(x)
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.BeTrue()/Assert.IsTrue(\1)/g' "$file"

    # Handle .Should().BeFalse() -> Assert.IsFalse(x)
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.BeFalse()/Assert.IsFalse(\1)/g' "$file"

    # Handle .Should().BeGreaterThan(n) -> Assert.IsTrue(x > n)
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.BeGreaterThan(\([^)]*\))/Assert.IsTrue(\1 > \2)/g' "$file"

    # Handle .Should().HaveCountGreaterThan(n) -> Assert.IsTrue(x.Count() > n)
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.HaveCountGreaterThan(\([^)]*\))/Assert.IsTrue(\1.Count() > \2)/g' "$file"

    # Handle .Should().HaveCount(n) -> Assert.AreEqual(n, x.Count())
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.HaveCount(\([^)]*\))/Assert.AreEqual(\2, \1.Count())/g' "$file"

    # Handle .Should().Be(x) with message ->  Assert.AreEqual(x, var, msg)
    perl -i -pe 's/(\w+)\.Should\(\)\.Be\(([^,)]+),\s*(\$"[^"]*"|"[^"]*")\)/Assert.AreEqual($2, $1, $3)/g' "$file"

    # Handle .Should().Be(x) without message -> Assert.AreEqual(x, var)
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.Be(\([^)]*\))/Assert.AreEqual(\2, \1)/g' "$file"

    # Handle .Should().Contain(x => ...) -> Assert.IsTrue(collection.Any(x => ...))
    perl -i -pe 's/(\w+)\.Should\(\)\.Contain\((\w+\s*=>\s*[^)]+)\)/Assert.IsTrue($1.Any($2))/g' "$file"

    # Handle .Should().NotContain(x => ...) -> Assert.IsFalse(collection.Any(x => ...))
    perl -i -pe 's/(\w+)\.Should\(\)\.NotContain\((\w+\s*=>\s*[^)]+)\)/Assert.IsFalse($1.Any($2))/g' "$file"

    # Handle .Should().OnlyContain(x => ...) with message -> Assert.IsTrue(collection.All(x => ...), msg)
    perl -i -pe 's/(\w+)\.Should\(\)\.OnlyContain\((\w+\s*=>\s*[^,)]+),\s*("[^"]*"|\$"[^"]*")\)/Assert.IsTrue($1.All($2), $3)/g' "$file"

    # Handle .Should().OnlyContain(x => ...) without message -> Assert.IsTrue(collection.All(x => ...))
    perl -i -pe 's/(\w+)\.Should\(\)\.OnlyContain\((\w+\s*=>\s*[^)]+)\)/Assert.IsTrue($1.All($2))/g' "$file"

    # Handle .Should().Contain("string") -> Assert.IsTrue(collection.Contains("string"))
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.Contain(\([^=][^)]*\))/Assert.IsTrue(\1.Contains(\2))/g' "$file"

    # Handle .Should().NotContain("string") with message -> Assert.IsFalse(collection.Contains("string"), msg)
    perl -i -pe 's/(\w+)\.Should\(\)\.NotContain\(([^,)]+),\s*("[^"]*"|\$"[^"]*")\)/Assert.IsFalse($1.Contains($2), $3)/g' "$file"

    # Handle .Should().NotContain("string") without message -> Assert.IsFalse(collection.Contains("string"))
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.NotContain(\([^)]*\))/Assert.IsFalse(\1.Contains(\2))/g' "$file"

    # Handle .Should().Equal(expected) with message -> CollectionAssert.AreEqual(expected.ToList(), actual.ToList(), msg)
    perl -i -pe 's/(\w+)\.Should\(\)\.Equal\(([^,)]+),\s*("[^"]*"|\$"[^"]*")\)/CollectionAssert.AreEqual($2.ToList(), $1.ToList(), $3)/g' "$file"

    # Handle .Should().Equal(expected) without message -> CollectionAssert.AreEqual(expected.ToList(), actual.ToList())
    sed -i 's/\([a-zA-Z0-9_!]\+\)\.Should()\.Equal(\([^)]*\))/CollectionAssert.AreEqual(\2.ToList(), \1.ToList())/g' "$file"

    echo "Converted $file successfully"
}

# Convert all 5 remaining files
convert_file "QueryBuilderDemo.Tests/QueryBuilderTests/RelationshipTests.cs"
convert_file "QueryBuilderDemo.Tests/QueryBuilderTests/SplitIncludesTests.cs"
convert_file "QueryBuilderDemo.Tests/QueryBuilderTests/WildcardQueryTests.cs"
convert_file "QueryBuilderDemo.Tests/QueryBuilderTests/HierarchicalOrderingAndFilteringTests.cs"
convert_file "QueryBuilderDemo.Tests/QueryBuilderTests/ExpandFieldsToScalarsTests.cs"

echo "All files converted!"
