using System;
using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Project entity
    /// </summary>
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public decimal Budget { get; set; }

        // Foreign key
        public int ClientId { get; set; }

        // Navigation properties
        public Client? Client { get; set; }
        [DLINQOrderbyAttribute("DueDate")]
        [WhereAttribute("Status != \"Completed\"")]
        public List<Task> Tasks { get; set; } = new();
        [DLINQOrderbyAttribute("LastName")]
        [DLINQOrderbyAttribute("FirstName")]
        public List<Employee> TeamMembers { get; set; } = new();
    }
}
