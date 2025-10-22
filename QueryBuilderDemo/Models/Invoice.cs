using System;
using PbsApi.Utils.Model;

namespace QueryBuilderDemo.Models
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
        [RecursiveIncludeLevel(2)]
        public Client? Client { get; set; }
        [RecursiveIncludeLevel(2)]
        public List<Payment> Payments { get; set; } = new();
    }
}
