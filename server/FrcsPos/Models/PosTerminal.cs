using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class PosTerminal : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public string Name { get; set; } = default!;
        public string? LocationDescription { get; set; }
        public string? SerialNumber { get; set; }

        public ICollection<PosSession> Session { get; set; } = [];
        public ICollection<Sale> Sales { get; set; } = [];
    }
}