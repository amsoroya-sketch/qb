using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Models
{
    public class Organisation
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public int FoundYear { get; set; }

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        public List<Department> Departments { get; set; } = new();
    }
}
