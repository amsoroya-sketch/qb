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

        // Navigation properties - all have RecursiveIncludeLevel to prevent infinite loops
        [RecursiveIncludeLevel(2)]
        public Department? Department { get; set; }
        [RecursiveIncludeLevel(2)]
        public Role? Role { get; set; }
        [RecursiveIncludeLevel(2)]
        [DLINQOrderbyAttribute("Deadline")]
        public List<Project> Projects { get; set; } = new();
        [RecursiveIncludeLevel(2)]
        [DLINQOrderbyAttribute("Category")]
        [DLINQOrderbyAttribute("Name")]
        public List<Skill> Skills { get; set; } = new();
        [RecursiveIncludeLevel(2)]
        [DLINQOrderbyAttribute("ValidUntil", descending: true)]
        [WhereAttribute("ValidUntil >= DateTime.Now")]
        public List<Certification> Certifications { get; set; } = new();
        [RecursiveIncludeLevel(2)]
        [DLINQOrderbyAttribute("DueDate")]
        [WhereAttribute("Status != \"Completed\"")]
        public List<Task> Tasks { get; set; } = new();
        [RecursiveIncludeLevel(2)]
        [DLINQOrderbyAttribute("Name")]
        public List<Team> Teams { get; set; } = new();
        [RecursiveIncludeLevel(2)]
        public Schedule? Schedule { get; set; }
    }
}
