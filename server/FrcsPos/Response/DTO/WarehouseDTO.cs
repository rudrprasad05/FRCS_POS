using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class WarehouseDTO : BaseDTO
    {
        public int CompanyId { get; set; }
        public string Name { get; set; } = default!;
        public string? Location { get; set; }

    }
}