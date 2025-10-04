using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.DTO;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class ProductDTO : BaseDTO
    {
        public int CompanyId { get; set; }
        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public string? Barcode { get; set; }
        public decimal Price { get; set; }
        public int TaxCategoryId { get; set; }
        public TaxCategoryDTO TaxCategory { get; set; } = default!;
        public bool IsPerishable { get; set; } = false;
        public int MediaId { get; set; } = default!;
        public MediaDto? Media { get; set; } = default!;
        public int? MaxStock { get; set; } = 0;
        public int FirstWarningInDays { get; set; }
        public int CriticalWarningInHours { get; set; }
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = default!;
        public List<ProductVariantDTO> Variants { get; set; } = [];

    }

    public class NewProdJson
    {
        public string TaxCategoryId { get; set; } = default!;
        public string SupplierId { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public bool IsPerishable { get; set; }
        public int? FirstWarningInDays { get; set; } = default!;
        public int? CriticalWarningInHours { get; set; } = default!;
    }

    public class InitialProductCreationData : BaseDTO
    {
        public List<TaxCategoryDTO> TaxCategories { get; set; } = default!;
        public List<SupplierDTO> Suppliers { get; set; } = default!;
    }

    public class ProductEditInfo
    {
        public ProductDTO Product { get; set; } = default!;
        public List<TaxCategoryDTO> TaxCategories { get; set; } = default!;
    }

    public class GetProductDTO
    {
        public bool? ForPos { get; set; } = false;
    }


}