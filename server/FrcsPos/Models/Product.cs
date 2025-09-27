using System.Collections.Generic;

namespace FrcsPos.Models
{
    public class Product : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public string Barcode { get; set; } = default!;
        public decimal Price { get; set; }

        public int FirstWarningInDays { get; set; } = 7;
        public int CriticalWarningInHours { get; set; } = 24;

        public int TaxCategoryId { get; set; }
        public TaxCategory TaxCategory { get; set; } = default!;

        public bool IsPerishable { get; set; } = false;
        public Media? Media { get; set; } = null!;
        public int? MediaId { get; set; } = null!;

        public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    }
}
