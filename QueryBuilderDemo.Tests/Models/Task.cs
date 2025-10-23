using System;
using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Task entity with default ordering by DueDate (most urgent first)
    /// Filtered to exclude completed tasks by default
    /// </summary>
    [DLINQOrderby("DueDate")]
    [Where("Status != \"Completed\"")]
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }

        // Foreign keys
        public int ProjectId { get; set; }
        public int? AssignedToId { get; set; }

        // Navigation properties
        [RecursiveIncludeLevel(2)]
        public Project? Project { get; set; }
        [RecursiveIncludeLevel(2)]
        public Employee? AssignedTo { get; set; }
    }
}
