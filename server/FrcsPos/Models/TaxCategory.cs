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

        public string Name { get; set; } = default!; 
        public decimal RatePercent { get; set; } 

        public ICollection<Product> Products { get; set; } = [];
    }
}