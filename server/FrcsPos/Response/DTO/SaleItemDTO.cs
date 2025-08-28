using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class SaleItemDTO : BaseDTO
    {
        public int SaleId { get; set; }
        public SaleDTO? Sale { get; set; } = null;
        public int ProductId { get; set; }
        public ProductDTO Product { get; set; } = default!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxRatePercent { get; set; }
        public decimal LineTotal { get; set; }
    }
}