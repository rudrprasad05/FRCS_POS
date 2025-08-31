using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class PosTerminalDTO : BaseDTO
    {
        public CompanyDTO Company { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string LocationDescription { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public ICollection<PosSessionDTO> Session { get; set; } = [];
        public ICollection<SaleDTO> Sales { get; set; } = [];

    }

    public class NewPosTerminalInit
    {
        public string Prefix { get; set; } = default!;
        public string Name { get; set; } = default!;
        public bool IsActive { get; set; } = true;
        public CompanyDTO Company { get; set; } = null!;
    }
}