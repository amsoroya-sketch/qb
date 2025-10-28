using System;

namespace QueryBuilderDemo.Tests.Models
{
    public class Schedule
    {
        public int Id { get; set; }
        public string Day { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        // Foreign key
        public int EmployeeId { get; set; }

        // Navigation property
        public Employee? Employee { get; set; }
    }
}
