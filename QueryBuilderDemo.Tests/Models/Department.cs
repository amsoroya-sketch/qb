
namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Department entity
    /// </summary>
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Budget { get; set; }
        public string Head { get; set; } = string.Empty;

        // Foreign key
        public int OrganisationId { get; set; }

        // Navigation properties
        public Organisation? Organisation { get; set; }
        public List<Employee> Employees { get; set; } = new();
    }
}
