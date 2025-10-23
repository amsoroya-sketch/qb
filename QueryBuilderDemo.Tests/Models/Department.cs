using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Department entity with default ordering by Name (alphabetical)
    /// </summary>
    [DLINQOrderby("Name")]
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Budget { get; set; }
        public string Head { get; set; } = string.Empty;

        // Foreign key
        public int OrganisationId { get; set; }

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        public Organisation? Organisation { get; set; }
        [RecursiveIncludeLevel(2)]
        public List<Employee> Employees { get; set; } = new();
    }
}
