
namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Skill entity
    /// </summary>
    public class Skill
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Proficiency { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;

        // Navigation properties - many-to-many
        public List<Employee> Employees { get; set; } = new();
    }
}
