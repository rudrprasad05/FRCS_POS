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
        public ProductVariantDTO? Product { get; set; } = null;

        public int? WarehouseId { get; set; }
        public WarehouseDTO? Warehouse { get; set; } = null;

        public int Quantity { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime RecievedDate { get; set; }
    }

    public class LoadPreCreationInfo
    {
        public CompanyDTO Company { get; set; } = default!;
        public List<ProductVariantDTO> Products { get; set; } = [];
        public List<WarehouseDTO> Warehouses { get; set; } = [];
        public List<SupplierDTO> Suppliers { get; set; } = [];

    }



}