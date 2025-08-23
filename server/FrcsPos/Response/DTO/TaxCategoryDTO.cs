using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Response.DTO;

namespace FrcsPos.Response.DTO
{
    public class TaxCategoryDTO : BaseDTO
    {
        public string Name { get; set; } = default!;
        public decimal RatePercent { get; set; }
    }
}