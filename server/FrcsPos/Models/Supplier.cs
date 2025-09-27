using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class Supplier : BaseModel
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;

        public string ContactName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        public string TaxNumber { get; set; } = string.Empty;

        public int CompanyId { get; set; } = 0;
        public Company Company { get; set; } = null!;

        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<ProductBatch> Batches { get; set; } = new List<ProductBatch>();

    }
}