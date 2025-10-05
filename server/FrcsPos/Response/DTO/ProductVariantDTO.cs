using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.DTO;

namespace FrcsPos.Response.DTO
{
    public class ProductVariantDTO : BaseDTO
    {
        public int ProductId { get; set; }
        public ProductDTO? Product { get; set; } = null;

        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public string Barcode { get; set; } = default!;
        public decimal Price { get; set; }
        public int? FirstWarningInDays { get; set; } = 7;
        public int? CriticalWarningInHours { get; set; } = 24;
        public int MediaId { get; set; } = default!;
        public MediaDto? Media { get; set; } = default!;
        public bool? IsPerishable { get; set; } = null;

        public int? MaxStock { get; set; } = 0;
        public SupplierDTO? Supplier { get; set; } = null;
        public TaxCategoryDTO? TaxCategory { get; set; } = null;
    }

    public class NewVarData
    {
        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public string Barcode { get; set; } = default!;
        public decimal Price { get; set; }
    }

    public class EditVarData
    {
        public string Name { get; set; } = default!;
        public string? UUID { get; set; } = null;
        public string Sku { get; set; } = default!;
        public string Barcode { get; set; } = default!;
        public decimal Price { get; set; }
    }
}