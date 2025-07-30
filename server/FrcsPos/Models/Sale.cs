using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public enum SaleStatus
    {
        Pending = 1,
        Completed = 2,
        Refunded = 3,
        Voided = 4
    }

    public class Sale : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public int POSTerminalId { get; set; }
        public PosTerminal POSTerminal { get; set; } = default!;

        public string CashierId { get; set; } = null!;
        public User Cashier { get; set; } = default!;

        public string InvoiceNumber { get; set; } = default!;
        public decimal Subtotal { get; set; }
        public decimal TaxTotal { get; set; }
        public decimal Total { get; set; }
        public SaleStatus Status { get; set; } = SaleStatus.Completed;

        public ICollection<SaleItem> Items { get; set; } = new List<SaleItem>();
        public ICollection<RefundRequest> Refunds { get; set; } = new List<RefundRequest>();
    }
}