using System;

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
        public List<MdTask> Tasks { get; set; } = new();
        public List<Employee> TeamMembers { get; set; } = new();
    }
}
