using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class NewProductRequest
    {
        public string ProductName { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public decimal Price { get; set; } = 0;
        public string Barcode { get; set; } = string.Empty;
        public bool IsPerishable { get; set; } = false;
        public IFormFile? File { get; set; } = null!;
        public int TaxCategoryId { get; set; } = default!;
        public string CompanyName { get; set; } = string.Empty;
        public int? FirstWarningInDays { get; set; } = null;
        public int? CriticalWarningInHours { get; set; } = null;
    }
}