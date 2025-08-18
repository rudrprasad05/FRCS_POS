using System.Collections.Generic;

namespace FrcsPos.Models
{
    public class Product : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public string? Barcode { get; set; }
        public decimal Price { get; set; }

        public int TaxCategoryId { get; set; }
        public TaxCategory TaxCategory { get; set; } = default!;

        public bool IsPerishable { get; set; } = false;

        public ICollection<ProductBatch> Batches { get; set; } = new List<ProductBatch>();
        public ICollection<SaleItem> SaleItems { get; set; } = new List<SaleItem>();
    }
}
