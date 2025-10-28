using System;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Task entity (renamed to MdTask to avoid conflict with System.Threading.Tasks.Task)
    /// </summary>
    public class MdTask
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }

        // Foreign keys
        public int ProjectId { get; set; }
        public int? AssignedToId { get; set; }

        // Navigation properties
        public Project? Project { get; set; }
        public Employee? AssignedTo { get; set; }
    }
}
