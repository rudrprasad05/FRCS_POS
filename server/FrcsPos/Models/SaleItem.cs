using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class SaleItem : BaseModel
    {
        public int SaleId { get; set; }
        public Sale Sale { get; set; } = default!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }     
        public decimal TaxRatePercent { get; set; } 
        public decimal LineTotal { get; set; }     
    
    }
}