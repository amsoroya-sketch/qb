using System;

namespace QueryBuilderDemo.Models
{
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
        public List<Task> Tasks { get; set; } = new();
        public List<Employee> TeamMembers { get; set; } = new();
    }
}
