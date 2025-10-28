using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Team entity
    /// </summary>
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Purpose { get; set; } = string.Empty;
        public int Size { get; set; }

        // Navigation properties - many-to-many
        [DLINQOrderbyAttribute("LastName")]
        [DLINQOrderbyAttribute("FirstName")]
        public List<Employee> Members { get; set; } = new();
        public List<Meeting> Meetings { get; set; } = new();
    }
}
