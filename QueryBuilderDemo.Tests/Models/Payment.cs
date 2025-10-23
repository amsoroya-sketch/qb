using System;
using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Tests.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime DatePaid { get; set; }
        public string Method { get; set; } = string.Empty;

        // Foreign key
        public int InvoiceId { get; set; }

        // Navigation property
        [RecursiveIncludeLevel(2)]
        public Invoice? Invoice { get; set; }
    }
}
