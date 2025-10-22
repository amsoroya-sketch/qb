using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;

        // Foreign key
        public int LocationId { get; set; }

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        public Location? Location { get; set; }
        [RecursiveIncludeLevel(2)]
        public List<Project> Projects { get; set; } = new();
        [RecursiveIncludeLevel(2)]
        public List<Invoice> Invoices { get; set; } = new();
    }
}
