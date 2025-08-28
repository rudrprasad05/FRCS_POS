using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class SaleDTO : BaseDTO
    {
        public int CompanyId { get; set; }
        public CompanyDTO Company { get; set; } = default!;

        public int PosSessionId { get; set; }
        public PosSessionDTO PosSession { get; set; } = default!;

        public string CashierId { get; set; } = null!;
        public UserDTO Cashier { get; set; } = default!;

        public string InvoiceNumber { get; set; } = default!;
        public decimal Subtotal { get; set; }
        public decimal TaxTotal { get; set; }
        public decimal Total { get; set; }
        public SaleStatus Status { get; set; } = SaleStatus.COMPLETED;

        public ICollection<SaleItemDTO> Items { get; set; } = [];
        public ICollection<RefundItemDTO> Refunds { get; set; } = [];
    }
}