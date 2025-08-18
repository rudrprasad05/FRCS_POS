using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IInventoryRepository
    {
        // Product Batch Management
        Task<ApiResponse<ProductBatchDTO>> CreateProductBatchAsync(NewProductBatchRequest request);
        Task<ApiResponse<ProductBatchDTO>> UpdateProductBatchAsync(UpdateProductBatchRequest request);
        Task<ApiResponse<bool>> DeleteProductBatchAsync(string uuid);
        Task<ApiResponse<ProductBatchDTO>> GetProductBatchByUuidAsync(string uuid);
        Task<ApiResponse<List<ProductBatchDTO>>> GetProductBatchesByProductIdAsync(int productId);
        Task<ApiResponse<List<ProductBatchDTO>>> GetProductBatchesByWarehouseIdAsync(int warehouseId);
        
        // Inventory Reports
        Task<ApiResponse<InventorySummaryDTO>> GetInventorySummaryAsync(int companyId);
        Task<ApiResponse<List<ProductStockDTO>>> GetLowStockProductsAsync(int companyId, int threshold = 10);
        Task<ApiResponse<List<ProductBatchDTO>>> GetExpiringProductBatchesAsync(int companyId, int daysThreshold = 30);
        Task<ApiResponse<ProductStockDTO>> GetProductByBarcodeAsync(int companyId, string barcode);
        
        // Stock Transfers
        Task<ApiResponse<StockTransferDTO>> CreateStockTransferAsync(NewStockTransferRequest request);
        Task<ApiResponse<List<StockTransferDTO>>> GetStockTransferHistoryAsync(int companyId, RequestQueryObject queryObject);
    }
}