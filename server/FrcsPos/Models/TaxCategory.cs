using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class TaxCategory : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public string Name { get; set; } = default!; // e.g., "VAT 15%", "Exempt"
        public decimal RatePercent { get; set; } // 0, 15, etc.

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}