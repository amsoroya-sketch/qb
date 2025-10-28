using System;

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
        public Invoice? Invoice { get; set; }
    }
}
