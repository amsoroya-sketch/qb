using System;

namespace QueryBuilderDemo.Tests.Models
{
    public class Meeting
    {
        public int Id { get; set; }
        public string Topic { get; set; } = string.Empty;
        public DateTime ScheduleTime { get; set; }
        public int Duration { get; set; }

        // Foreign key
        public int TeamId { get; set; }

        // Navigation property
        public Team? Team { get; set; }
    }
}
