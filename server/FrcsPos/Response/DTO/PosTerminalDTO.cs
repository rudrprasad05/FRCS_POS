using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class PosTerminalDTO : BaseDTO
    {
        public CompanyDTO Company { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string LocationDescription { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
    }
}