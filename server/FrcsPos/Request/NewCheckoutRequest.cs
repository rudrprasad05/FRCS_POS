using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Request
{
    public class NewCheckoutRequest
    {
        public int CompanyId { get; set; }
        public int PosSessionId { get; set; }
        public string CashierId { get; set; } = null!;
        public decimal Subtotal { get; set; }
        public decimal TaxTotal { get; set; }
        public decimal Total { get; set; }
        public SaleStatus Status { get; set; } = SaleStatus.PENDING;
        public List<SaleItem> Items { get; set; } = [];
    }
}