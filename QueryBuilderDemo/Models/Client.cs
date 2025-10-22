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
        public Location? Location { get; set; }
        public List<Project> Projects { get; set; } = new();
        public List<Invoice> Invoices { get; set; } = new();
    }
}
