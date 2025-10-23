using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Skill entity with default ordering by Category, then Name
    /// </summary>
    [DLINQOrderby("Category")]
    [DLINQOrderby("Name")]
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Proficiency { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;

        // Navigation properties - many-to-many
        [RecursiveIncludeLevel(2)]
        public List<Employee> Employees { get; set; } = new();
    }
}
