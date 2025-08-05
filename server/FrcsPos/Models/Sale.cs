using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public enum SaleStatus
    {
        PENDING,
        COMPLETED,
        REFUNDED,
        VOIDED,
    }

    public class Sale : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;
        
        // Since PosSession has a composite key, we need both parts to reference it
        public int PosSessionId { get; set; }
        public PosSession PosSession { get; set; } = default!;
        
        public string CashierId { get; set; } = null!;
        public User Cashier { get; set; } = default!;
        
        public string InvoiceNumber { get; set; } = default!;
        public decimal Subtotal { get; set; }
        public decimal TaxTotal { get; set; }
        public decimal Total { get; set; }
        public SaleStatus Status { get; set; } = SaleStatus.COMPLETED;
        
        public ICollection<SaleItem> Items { get; set; } = [];
        public ICollection<RefundRequest> Refunds { get; set; } = [];
    }
}