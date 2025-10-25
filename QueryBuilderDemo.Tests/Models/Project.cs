using System;
using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Project entity with default ordering by Deadline (most urgent first)
    /// </summary>
    [DLINQOrderbyAttribute("Deadline")]
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Deadline { get; set; }
        public decimal Budget { get; set; }

        // Foreign key
        public int ClientId { get; set; }

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        public Client? Client { get; set; }
        [RecursiveIncludeLevel(2)]
        public List<Task> Tasks { get; set; } = new();
        [RecursiveIncludeLevel(2)]
        public List<Employee> TeamMembers { get; set; } = new();
    }
}
