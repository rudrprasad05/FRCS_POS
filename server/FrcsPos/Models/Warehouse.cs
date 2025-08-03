using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class Warehouse : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string? Location { get; set; }
        public ICollection<ProductBatch> Batches { get; set; } = new List<ProductBatch>();

    }
}