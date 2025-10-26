using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Role entity
    /// </summary>
    public class Role
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        [DLINQOrderbyAttribute("LastName")]
        [DLINQOrderbyAttribute("FirstName")]
        public List<Employee> Employees { get; set; } = new();
    }
}
