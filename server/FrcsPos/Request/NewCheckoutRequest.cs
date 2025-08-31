using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Request
{
    public class NewCheckoutRequest
    {
        public string CompanyName { get; set; } = null!;
        public int PosSessionId { get; set; }
        public string CashierId { get; set; } = null!;
        public decimal Subtotal { get; set; }
        public decimal TaxTotal { get; set; }
        public decimal Total { get; set; }
        public List<SaleItemDTO> Items { get; set; } = [];
    }
}