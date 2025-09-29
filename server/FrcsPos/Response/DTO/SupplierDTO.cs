using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class SupplierDTO : BaseDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;

        public string ContactName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        public string TaxNumber { get; set; } = string.Empty;

        public ICollection<ProductDTO> Products { get; set; } = new List<ProductDTO>();
        public ICollection<ProductBatchDTO> Batches { get; set; } = new List<ProductBatchDTO>();


    }
}