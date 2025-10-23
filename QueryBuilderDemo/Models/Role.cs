using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Models
{
    /// <summary>
    /// Role entity with default ordering by Level (hierarchy), then Title
    /// </summary>
    [DLINQOrderby("Level")]
    [DLINQOrderby("Title")]
    public class Role
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        public List<Employee> Employees { get; set; } = new();
    }
}
