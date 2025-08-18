using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/inventory")]
    [ApiController]
    public class InventoryController : BaseController
    {
        private readonly IInventoryRepository _inventoryRepository;

        public InventoryController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<InventoryController> logger,
            IInventoryRepository inventoryRepository
        ) : base(configuration, tokenService, logger)
        {
            _inventoryRepository = inventoryRepository;
        }

        [HttpPost("product-batch/create")]
        public async Task<IActionResult> CreateProductBatch([FromBody] NewProductBatchRequest request)
        {
            var response = await _inventoryRepository.CreateProductBatchAsync(request);
            return Ok(response);
        }

        [HttpPut("product-batch/update")]
        public async Task<IActionResult> UpdateProductBatch([FromBody] UpdateProductBatchRequest request)
        {
            var response = await _inventoryRepository.UpdateProductBatchAsync(request);
            return Ok(response);
        }

        [HttpDelete("product-batch/{uuid}")]
        public async Task<IActionResult> DeleteProductBatch(string uuid)
        {
            var response = await _inventoryRepository.DeleteProductBatchAsync(uuid);
            return Ok(response);
        }

        [HttpGet("product-batch/{uuid}")]
        public async Task<IActionResult> GetProductBatchByUuid(string uuid)
        {
            var response = await _inventoryRepository.GetProductBatchByUuidAsync(uuid);
            return Ok(response);
        }

        [HttpGet("product/{productId}/batches")]
        public async Task<IActionResult> GetProductBatchesByProductId(int productId)
        {
            var response = await _inventoryRepository.GetProductBatchesByProductIdAsync(productId);
            return Ok(response);
        }

        [HttpGet("warehouse/{warehouseId}/batches")]
        public async Task<IActionResult> GetProductBatchesByWarehouseId(int warehouseId)
        {
            var response = await _inventoryRepository.GetProductBatchesByWarehouseIdAsync(warehouseId);
            return Ok(response);
        }

        [HttpGet("product/barcode/{companyId}/{barcode}")]
        public async Task<IActionResult> GetProductByBarcode(int companyId, string barcode)
        {
            var response = await _inventoryRepository.GetProductByBarcodeAsync(companyId, barcode);
            return Ok(response);
        }

        [HttpGet("summary/{companyId}")]
        public async Task<IActionResult> GetInventorySummary(int companyId)
        {
            var response = await _inventoryRepository.GetInventorySummaryAsync(companyId);
            return Ok(response);
        }

        [HttpGet("low-stock/{companyId}")]
        public async Task<IActionResult> GetLowStockProducts(int companyId, [FromQuery] int threshold = 10)
        {
            var response = await _inventoryRepository.GetLowStockProductsAsync(companyId, threshold);
            return Ok(response);
        }

        [HttpGet("expiring/{companyId}")]
        public async Task<IActionResult> GetExpiringProductBatches(int companyId, [FromQuery] int daysThreshold = 30)
        {
            var response = await _inventoryRepository.GetExpiringProductBatchesAsync(companyId, daysThreshold);
            return Ok(response);
        }

        [HttpPost("transfer/create")]
        public async Task<IActionResult> CreateStockTransfer([FromBody] NewStockTransferRequest request)
        {
            var response = await _inventoryRepository.CreateStockTransferAsync(request);
            return Ok(response);
        }

        [HttpGet("transfer/history/{companyId}")]
        public async Task<IActionResult> GetStockTransferHistory(int companyId, [FromQuery] RequestQueryObject queryObject)
        {
            var response = await _inventoryRepository.GetStockTransferHistoryAsync(companyId, queryObject);
            return Ok(response);
        }
    }
}