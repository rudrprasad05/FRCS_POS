using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class ProductVariant : BaseModel
    {
        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public string Barcode { get; set; } = default!;
        public decimal Price { get; set; }

        public ICollection<ProductBatch> Batches { get; set; } = new List<ProductBatch>();
        public ICollection<SaleItem> SaleItems { get; set; } = [];

        public int? FirstWarningInDays { get; set; }
        public int? CriticalWarningInHours { get; set; }

    }
}