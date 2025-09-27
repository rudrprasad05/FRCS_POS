using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class ProductVariantDTO : BaseDTO
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public string Barcode { get; set; } = default!;
        public decimal Price { get; set; }

    }
}