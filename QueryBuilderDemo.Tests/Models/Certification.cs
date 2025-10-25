using System;
using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    /// <summary>
    /// Certification entity with default ordering by ValidUntil (descending - newest first)
    /// Filtered to show only valid (non-expired) certifications by default
    /// </summary>
    [DLINQOrderbyAttribute("ValidUntil", descending: true)]
    [WhereAttribute("ValidUntil >= DateTime.Now")]
    public class Certification
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
        public DateTime ValidUntil { get; set; }

        // Foreign key
        public int EmployeeId { get; set; }

        // Navigation property
        [RecursiveIncludeLevel(2)]
        public Employee? Employee { get; set; }
    }
}
