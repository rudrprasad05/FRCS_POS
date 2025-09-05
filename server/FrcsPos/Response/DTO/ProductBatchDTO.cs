using System;
using System.Collections.Generic;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class ProductBatchDTO : BaseDTO
    {
        public int? CompanyId { get; set; }
        public CompanyDTO? Company { get; set; } = null;

        public int? ProductId { get; set; }
        public ProductDTO? Product { get; set; } = null;

        public int? WarehouseId { get; set; }
        public WarehouseDTO? Warehouse { get; set; } = null;

        public int Quantity { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    public class LoadPreCreationInfo
    {
        public CompanyDTO Company { get; set; } = default!;
        public List<ProductDTO> Products { get; set; } = [];
        public List<WarehouseDTO> Warehouses { get; set; } = [];
    }



}