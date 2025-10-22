using System;
using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Models
{
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
