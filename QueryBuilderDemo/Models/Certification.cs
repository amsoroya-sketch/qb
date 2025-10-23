using System;
using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Models
{
    /// <summary>
    /// Certification entity with default ordering by ValidUntil (descending - newest first)
    /// Filtered to show only valid (non-expired) certifications by default
    /// </summary>
    [DLINQOrderby("ValidUntil", descending: true)]
    [Where("ValidUntil >= DateTime.Now")]
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
