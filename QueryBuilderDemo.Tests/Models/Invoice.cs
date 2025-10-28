using System;

namespace QueryBuilderDemo.Tests.Models
{
    public class Invoice
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime DateIssued { get; set; }
        public DateTime DueDate { get; set; }

        // Foreign key
        public int ClientId { get; set; }

        // Navigation properties
        public Client? Client { get; set; }
        public List<Payment> Payments { get; set; } = new();
    }
}
