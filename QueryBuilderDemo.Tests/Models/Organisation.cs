using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Organisation entity
    /// </summary>
    public class Organisation
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public int FoundYear { get; set; }

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        [DLINQOrderbyAttribute("Name")]
        public List<Department> Departments { get; set; } = new();
    }
}
