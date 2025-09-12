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
    }

    public class InitialProductCreationData : BaseDTO
    {
        public string Sku { get; set; } = default!;
        public List<TaxCategoryDTO> TaxCategories { get; set; } = default!;
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