using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace FrcsPos.Request
{
    public class WarehouseRequest
    {
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
    }
}
