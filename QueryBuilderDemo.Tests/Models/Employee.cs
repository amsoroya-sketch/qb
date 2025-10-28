
namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Employee entity
    /// </summary>
    public class Employee
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Foreign keys
        public int DepartmentId { get; set; }
        public int RoleId { get; set; }

        // Navigation properties
        public Department? Department { get; set; }
        public Role? Role { get; set; }
        public List<Project> Projects { get; set; } = new();
        public List<Skill> Skills { get; set; } = new();
        public List<Certification> Certifications { get; set; } = new();
        public List<Task> Tasks { get; set; } = new();
        public List<Team> Teams { get; set; } = new();
        public Schedule? Schedule { get; set; }
    }
}
