using System;
using System.Collections.Generic;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class ProductBatchDTO : BaseDTO
    {
        public int? CompanyId { get; set; }
        public Company? Company { get; set; } = null;

        public int? ProductId { get; set; }
        public Product? Product { get; set; } = null;

        public int? WarehouseId { get; set; }
        public Warehouse? Warehouse { get; set; } = null;

        public int Quantity { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    public class InventorySummaryDTO
    {
        public int TotalProducts { get; set; }
        public int TotalBatches { get; set; }
        public int TotalWarehouses { get; set; }
        public int LowStockProductsCount { get; set; }
        public int ExpiringProductsCount { get; set; }
        public decimal TotalInventoryValue { get; set; }
        public List<WarehouseInventorySummaryDTO> WarehouseSummaries { get; set; } = new();
    }

    public class WarehouseInventorySummaryDTO
    {
        public int WarehouseId { get; set; }
        public string WarehouseName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int ProductCount { get; set; }
        public int TotalItemsCount { get; set; }
        public decimal InventoryValue { get; set; }
    }

    public class ProductStockDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string? Barcode { get; set; }
        public decimal Price { get; set; }
        public bool IsPerishable { get; set; }
        public int TotalStock { get; set; }
        public Dictionary<string, int> StockByWarehouse { get; set; } = new();
    }

    public class StockTransferDTO
    {
        public int Id { get; set; }
        public string UUID { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public int SourceWarehouseId { get; set; }
        public string SourceWarehouseName { get; set; } = string.Empty;

        public int DestinationWarehouseId { get; set; }
        public string DestinationWarehouseName { get; set; } = string.Empty;

        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductSku { get; set; } = string.Empty;

        public int Quantity { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string TransferredByUserId { get; set; } = string.Empty;
        public string TransferredByUserName { get; set; } = string.Empty;
    }
}