using PbsApi.Utils.Model;

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
        [DLINQOrderbyAttribute("Deadline")]
        public List<Project> Projects { get; set; } = new();
        [DLINQOrderbyAttribute("Category")]
        [DLINQOrderbyAttribute("Name")]
        public List<Skill> Skills { get; set; } = new();
        [DLINQOrderbyAttribute("ValidUntil", descending: true)]
        [WhereAttribute("ValidUntil >= DateTime.Now")]
        public List<Certification> Certifications { get; set; } = new();
        [DLINQOrderbyAttribute("DueDate")]
        [WhereAttribute("Status != \"Completed\"")]
        public List<Task> Tasks { get; set; } = new();
        [DLINQOrderbyAttribute("Name")]
        public List<Team> Teams { get; set; } = new();
        public Schedule? Schedule { get; set; }
    }
}
