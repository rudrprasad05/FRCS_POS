using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public InventoryRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService
        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;
        }

        public async Task<ApiResponse<ProductBatchDTO>> CreateProductBatchAsync(NewProductBatchRequest request)
        {
            try
            {
                // Validate company, product and warehouse exist
                var company = await _context.Companies.FindAsync(request.CompanyId);
                if (company == null)
                    return ApiResponse<ProductBatchDTO>.Fail(message: "Company not found");

                var product = await _context.Products.FindAsync(request.ProductId);
                if (product == null)
                    return ApiResponse<ProductBatchDTO>.Fail(message: "Product not found");

                var warehouse = await _context.Warehouses.FindAsync(request.WarehouseId);
                if (warehouse == null)
                    return ApiResponse<ProductBatchDTO>.Fail(message: "Warehouse not found");

                // Create new batch
                var newBatch = new ProductBatch
                {
                    CompanyId = request.CompanyId,
                    ProductId = request.ProductId,
                    WarehouseId = request.WarehouseId,
                    Quantity = request.Quantity,
                    ExpiryDate = request.ExpiryDate,
                    UUID = Guid.NewGuid().ToString(),
                    CreatedOn = DateTime.UtcNow,
                    UpdatedOn = DateTime.UtcNow
                };

                await _context.ProductBatches.AddAsync(newBatch);
                await _context.SaveChangesAsync();

                // Create notification for low stock if needed
                if (product.IsPerishable && request.ExpiryDate.HasValue)
                {
                    var daysUntilExpiry = (request.ExpiryDate.Value - DateTime.UtcNow).Days;
                    if (daysUntilExpiry <= 30)
                    {
                        await CreateExpiryNotification(newBatch, daysUntilExpiry);
                    }
                }

                // Map to DTO and return
                return ApiResponse<ProductBatchDTO>.Ok(await MapToProductBatchDTO(newBatch));
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductBatchDTO>.Fail(message: $"Error creating product batch: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ProductBatchDTO>> UpdateProductBatchAsync(UpdateProductBatchRequest request)
        {
            try
            {
                var batch = await _context.ProductBatches
                    .FirstOrDefaultAsync(b => b.UUID == request.UUID);

                if (batch == null)
                    return ApiResponse<ProductBatchDTO>.Fail(message: "Product batch not found");

                // Update batch
                batch.Quantity = request.Quantity;
                batch.ExpiryDate = request.ExpiryDate;
                batch.UpdatedOn = DateTime.UtcNow;

                _context.ProductBatches.Update(batch);
                await _context.SaveChangesAsync();

                // Check if we need to create expiry notification
                if (batch.ExpiryDate.HasValue)
                {
                    var daysUntilExpiry = (batch.ExpiryDate.Value - DateTime.UtcNow).Days;
                    if (daysUntilExpiry <= 30)
                    {
                        await CreateExpiryNotification(batch, daysUntilExpiry);
                    }
                }

                // Map to DTO and return
                return ApiResponse<ProductBatchDTO>.Ok(await MapToProductBatchDTO(batch));
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductBatchDTO>.Fail(message: $"Error updating product batch: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteProductBatchAsync(string uuid)
        {
            try
            {
                var batch = await _context.ProductBatches
                    .FirstOrDefaultAsync(b => b.UUID == uuid);

                if (batch == null)
                    return ApiResponse<bool>.Fail(message: "Product batch not found");

                _context.ProductBatches.Remove(batch);
                await _context.SaveChangesAsync();

                return ApiResponse<bool>.Ok(true);
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.Fail(message: $"Error deleting product batch: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ProductBatchDTO>> GetProductBatchByUuidAsync(string uuid)
        {
            try
            {
                var batch = await _context.ProductBatches
                    .Include(b => b.Product)
                    .Include(b => b.Warehouse)
                    .Include(b => b.Company)
                    .FirstOrDefaultAsync(b => b.UUID == uuid);

                if (batch == null)
                    return ApiResponse<ProductBatchDTO>.Fail(message: "Product batch not found");

                return ApiResponse<ProductBatchDTO>.Ok(await MapToProductBatchDTO(batch));
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductBatchDTO>.Fail(message: $"Error retrieving product batch: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<ProductBatchDTO>>> GetProductBatchesByProductIdAsync(int productId)
        {
            try
            {
                var batches = await _context.ProductBatches
                    .Include(b => b.Product)
                    .Include(b => b.Warehouse)
                    .Include(b => b.Company)
                    .Where(b => b.ProductId == productId)
                    .ToListAsync();

                var batchDTOs = new List<ProductBatchDTO>();
                foreach (var batch in batches)
                {
                    batchDTOs.Add(await MapToProductBatchDTO(batch));
                }

                return ApiResponse<List<ProductBatchDTO>>.Ok(batchDTOs);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ProductBatchDTO>>.Fail(message: $"Error retrieving product batches: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<ProductBatchDTO>>> GetProductBatchesByWarehouseIdAsync(int warehouseId)
        {
            try
            {
                var batches = await _context.ProductBatches
                    .Include(b => b.Product)
                    .Include(b => b.Warehouse)
                    .Include(b => b.Company)
                    .Where(b => b.WarehouseId == warehouseId)
                    .ToListAsync();

                var batchDTOs = new List<ProductBatchDTO>();
                foreach (var batch in batches)
                {
                    batchDTOs.Add(await MapToProductBatchDTO(batch));
                }

                return ApiResponse<List<ProductBatchDTO>>.Ok(batchDTOs);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ProductBatchDTO>>.Fail(message: $"Error retrieving product batches: {ex.Message}");
            }
        }

        public async Task<ApiResponse<InventorySummaryDTO>> GetInventorySummaryAsync(int companyId)
        {
            try
            {
                var company = await _context.Companies.FindAsync(companyId);
                if (company == null)
                    return ApiResponse<InventorySummaryDTO>.Fail(message: "Company not found");

                // Get all products for the company
                var products = await _context.Products
                    .Where(p => p.CompanyId == companyId)
                    .ToListAsync();

                // Get all batches for the company
                var batches = await _context.ProductBatches
                    .Include(b => b.Product)
                    .Where(b => b.CompanyId == companyId)
                    .ToListAsync();

                // Get all warehouses for the company
                var warehouses = await _context.Warehouses
                    .Where(w => w.CompanyId == companyId)
                    .ToListAsync();

                // Calculate low stock products (less than 10 items)
                var productStockCounts = batches
                    .GroupBy(b => b.ProductId)
                    .ToDictionary(g => g.Key, g => g.Sum(b => b.Quantity));

                var lowStockCount = productStockCounts
                    .Count(p => p.Value < 10);

                // Calculate expiring products (within 30 days)
                var now = DateTime.UtcNow;
                var expiringCount = batches
                    .Count(b => b.ExpiryDate.HasValue && (b.ExpiryDate.Value - now).Days <= 30);

                // Calculate total inventory value
                decimal totalValue = 0;
                foreach (var batch in batches)
                {
                    totalValue += batch.Quantity * batch.Product.Price;
                }

                // Create warehouse summaries
                var warehouseSummaries = new List<WarehouseInventorySummaryDTO>();
                foreach (var warehouse in warehouses)
                {
                    var warehouseBatches = batches.Where(b => b.WarehouseId == warehouse.Id).ToList();
                    var warehouseProducts = warehouseBatches.Select(b => b.ProductId).Distinct().Count();
                    var warehouseItemsCount = warehouseBatches.Sum(b => b.Quantity);
                    var warehouseValue = warehouseBatches.Sum(b => b.Quantity * b.Product.Price);

                    warehouseSummaries.Add(new WarehouseInventorySummaryDTO
                    {
                        WarehouseId = warehouse.Id,
                        WarehouseName = warehouse.Name,
                        Location = warehouse.Location ?? "",
                        ProductCount = warehouseProducts,
                        TotalItemsCount = warehouseItemsCount,
                        InventoryValue = warehouseValue
                    });
                }

                // Create summary DTO
                var summary = new InventorySummaryDTO
                {
                    TotalProducts = products.Count,
                    TotalBatches = batches.Count,
                    TotalWarehouses = warehouses.Count,
                    LowStockProductsCount = lowStockCount,
                    ExpiringProductsCount = expiringCount,
                    TotalInventoryValue = totalValue,
                    WarehouseSummaries = warehouseSummaries
                };

                return ApiResponse<InventorySummaryDTO>.Ok(summary);
            }
            catch (Exception ex)
            {
                return ApiResponse<InventorySummaryDTO>.Fail(message: $"Error retrieving inventory summary: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<ProductStockDTO>>> GetLowStockProductsAsync(int companyId, int threshold = 10)
        {
            try
            {
                var company = await _context.Companies.FindAsync(companyId);
                if (company == null)
                    return ApiResponse<List<ProductStockDTO>>.Fail(message: "Company not found");

                // Get all products for the company
                var products = await _context.Products
                    .Where(p => p.CompanyId == companyId)
                    .ToListAsync();

                // Get all batches for the company
                var batches = await _context.ProductBatches
                    .Include(b => b.Warehouse)
                    .Where(b => b.CompanyId == companyId)
                    .ToListAsync();

                // Group batches by product
                var batchesByProduct = batches
                    .GroupBy(b => b.ProductId)
                    .ToDictionary(g => g.Key, g => g.ToList());

                // Create product stock DTOs for low stock products
                var lowStockProducts = new List<ProductStockDTO>();
                foreach (var product in products)
                {
                    if (!batchesByProduct.TryGetValue(product.Id, out var productBatches))
                    {
                        // Product has no batches, so it's definitely low stock (zero)
                        lowStockProducts.Add(new ProductStockDTO
                        {
                            ProductId = product.Id,
                            ProductName = product.Name,
                            Sku = product.Sku,
                            Barcode = product.Barcode,
                            Price = product.Price,
                            IsPerishable = product.IsPerishable,
                            TotalStock = 0,
                            StockByWarehouse = new Dictionary<string, int>()
                        });
                        continue;
                    }

                    var totalStock = productBatches.Sum(b => b.Quantity);
                    if (totalStock <= threshold)
                    {
                        // Create stock by warehouse dictionary
                        var stockByWarehouse = productBatches
                            .GroupBy(b => b.WarehouseId)
                            .ToDictionary(
                                g => g.First().Warehouse.Name,
                                g => g.Sum(b => b.Quantity)
                            );

                        lowStockProducts.Add(new ProductStockDTO
                        {
                            ProductId = product.Id,
                            ProductName = product.Name,
                            Sku = product.Sku,
                            Barcode = product.Barcode,
                            Price = product.Price,
                            IsPerishable = product.IsPerishable,
                            TotalStock = totalStock,
                            StockByWarehouse = stockByWarehouse
                        });
                    }
                }

                return ApiResponse<List<ProductStockDTO>>.Ok(lowStockProducts);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ProductStockDTO>>.Fail(message: $"Error retrieving low stock products: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<ProductBatchDTO>>> GetExpiringProductBatchesAsync(int companyId, int daysThreshold = 30)
        {
            try
            {
                var company = await _context.Companies.FindAsync(companyId);
                if (company == null)
                    return ApiResponse<List<ProductBatchDTO>>.Fail(message: "Company not found");

                var now = DateTime.UtcNow;
                var expiryDate = now.AddDays(daysThreshold);

                // Get expiring batches
                var expiringBatches = await _context.ProductBatches
                    .Include(b => b.Product)
                    .Include(b => b.Warehouse)
                    .Include(b => b.Company)
                    .Where(b => b.CompanyId == companyId &&
                           b.ExpiryDate.HasValue &&
                           b.ExpiryDate <= expiryDate)
                    .ToListAsync();

                var batchDTOs = new List<ProductBatchDTO>();
                foreach (var batch in expiringBatches)
                {
                    batchDTOs.Add(await MapToProductBatchDTO(batch));
                }

                return ApiResponse<List<ProductBatchDTO>>.Ok(batchDTOs);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<ProductBatchDTO>>.Fail(message: $"Error retrieving expiring product batches: {ex.Message}");
            }
        }

        public async Task<ApiResponse<StockTransferDTO>> CreateStockTransferAsync(NewStockTransferRequest request)
        {
            try
            {
                // Validate company, product and warehouses exist
                var company = await _context.Companies.FindAsync(request.CompanyId);
                if (company == null)
                    return ApiResponse<StockTransferDTO>.Fail(message: "Company not found");

                var product = await _context.Products.FindAsync(request.ProductId);
                if (product == null)
                    return ApiResponse<StockTransferDTO>.Fail(message: "Product not found");

                var sourceWarehouse = await _context.Warehouses.FindAsync(request.SourceWarehouseId);
                if (sourceWarehouse == null)
                    return ApiResponse<StockTransferDTO>.Fail(message: "Source warehouse not found");

                var destinationWarehouse = await _context.Warehouses.FindAsync(request.DestinationWarehouseId);
                if (destinationWarehouse == null)
                    return ApiResponse<StockTransferDTO>.Fail(message: "Destination warehouse not found");

                var user = await _context.Users.FindAsync(request.TransferredByUserId);
                if (user == null)
                    return ApiResponse<StockTransferDTO>.Fail(message: "User not found");

                // Check if source warehouse has enough stock
                var sourceBatches = await _context.ProductBatches
                    .Where(b => b.ProductId == request.ProductId &&
                           b.WarehouseId == request.SourceWarehouseId)
                    .ToListAsync();

                var availableStock = sourceBatches.Sum(b => b.Quantity);
                if (availableStock < request.Quantity)
                    return ApiResponse<StockTransferDTO>.Fail(message: "Not enough stock in source warehouse");

                // Create stock transfer record
                var transfer = new StockTransfer
                {
                    CompanyId = request.CompanyId,
                    SourceWarehouseId = request.SourceWarehouseId,
                    DestinationWarehouseId = request.DestinationWarehouseId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    Notes = request.Notes,
                    TransferredByUserId = request.TransferredByUserId,
                    UUID = Guid.NewGuid().ToString(),
                    CreatedOn = DateTime.UtcNow,
                    UpdatedOn = DateTime.UtcNow
                };

                await _context.StockTransfers.AddAsync(transfer);

                // Update source warehouse stock (reduce)
                var remainingToReduce = request.Quantity;
                foreach (var batch in sourceBatches.OrderBy(b => b.ExpiryDate)) // Use FIFO for stock reduction
                {
                    if (remainingToReduce <= 0) break;

                    var reduceAmount = Math.Min(batch.Quantity, remainingToReduce);
                    batch.Quantity -= reduceAmount;
                    remainingToReduce -= reduceAmount;

                    if (batch.Quantity <= 0)
                    {
                        _context.ProductBatches.Remove(batch);
                    }
                    else
                    {
                        _context.ProductBatches.Update(batch);
                    }
                }

                // Add stock to destination warehouse
                // Check if there's an existing batch with the same product in the destination
                var existingDestinationBatch = await _context.ProductBatches
                    .FirstOrDefaultAsync(b => b.ProductId == request.ProductId &&
                                       b.WarehouseId == request.DestinationWarehouseId);

                if (existingDestinationBatch != null)
                {
                    // Update existing batch
                    existingDestinationBatch.Quantity += request.Quantity;
                    existingDestinationBatch.UpdatedOn = DateTime.UtcNow;
                    _context.ProductBatches.Update(existingDestinationBatch);
                }
                else
                {
                    // Create new batch in destination warehouse
                    var newBatch = new ProductBatch
                    {
                        CompanyId = request.CompanyId,
                        ProductId = request.ProductId,
                        WarehouseId = request.DestinationWarehouseId,
                        Quantity = request.Quantity,
                        ExpiryDate = null, // No expiry date for transferred stock
                        UUID = Guid.NewGuid().ToString(),
                        CreatedOn = DateTime.UtcNow,
                        UpdatedOn = DateTime.UtcNow
                    };

                    await _context.ProductBatches.AddAsync(newBatch);
                }

                await _context.SaveChangesAsync();


                FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                    title: $"Stock Transfer: {product.Name}",
                    message: $"{request.Quantity} units of {product.Name} transferred from {sourceWarehouse.Name} to {destinationWarehouse.Name}",
                    isSuperAdmin: true,
                    type: NotificationType.SUCCESS
                ));

                // Map to DTO and return
                var transferDTO = new StockTransferDTO
                {
                    Id = transfer.Id,
                    UUID = transfer.UUID,
                    CreatedOn = transfer.CreatedOn,
                    UpdatedOn = transfer.UpdatedOn,
                    CompanyId = transfer.CompanyId,
                    CompanyName = company.Name,
                    SourceWarehouseId = transfer.SourceWarehouseId,
                    SourceWarehouseName = sourceWarehouse.Name,
                    DestinationWarehouseId = transfer.DestinationWarehouseId,
                    DestinationWarehouseName = destinationWarehouse.Name,
                    ProductId = transfer.ProductId,
                    ProductName = product.Name,
                    ProductSku = product.Sku,
                    Quantity = transfer.Quantity,
                    Notes = transfer.Notes ?? "",
                    TransferredByUserId = transfer.TransferredByUserId,
                    TransferredByUserName = user.UserName
                };

                return ApiResponse<StockTransferDTO>.Ok(transferDTO);
            }
            catch (Exception ex)
            {
                return ApiResponse<StockTransferDTO>.Fail(message: $"Error creating stock transfer: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<StockTransferDTO>>> GetStockTransferHistoryAsync(int companyId, RequestQueryObject queryObject)
        {
            try
            {
                var company = await _context.Companies.FindAsync(companyId);
                if (company == null)
                    return ApiResponse<List<StockTransferDTO>>.Fail(message: "Company not found");

                var query = _context.StockTransfers
                    .Include(t => t.Product)
                    .Include(t => t.SourceWarehouse)
                    .Include(t => t.DestinationWarehouse)
                    .Include(t => t.TransferredByUser)
                    .Where(t => t.CompanyId == companyId);

                // Apply pagination
                query = query
                    .Skip((queryObject.PageNumber - 1) * queryObject.PageSize)
                    .Take(queryObject.PageSize);

                var transfers = await query.ToListAsync();

                var transferDTOs = new List<StockTransferDTO>();
                foreach (var transfer in transfers)
                {
                    transferDTOs.Add(new StockTransferDTO
                    {
                        Id = transfer.Id,
                        UUID = transfer.UUID,
                        CreatedOn = transfer.CreatedOn,
                        UpdatedOn = transfer.UpdatedOn,
                        CompanyId = transfer.CompanyId,
                        CompanyName = company.Name,
                        SourceWarehouseId = transfer.SourceWarehouseId,
                        SourceWarehouseName = transfer.SourceWarehouse.Name,
                        DestinationWarehouseId = transfer.DestinationWarehouseId,
                        DestinationWarehouseName = transfer.DestinationWarehouse.Name,
                        ProductId = transfer.ProductId,
                        ProductName = transfer.Product.Name,
                        ProductSku = transfer.Product.Sku,
                        Quantity = transfer.Quantity,
                        Notes = transfer.Notes ?? "",
                        TransferredByUserId = transfer.TransferredByUserId,
                        TransferredByUserName = transfer.TransferredByUser.UserName
                    });
                }

                return ApiResponse<List<StockTransferDTO>>.Ok(transferDTOs);
            }
            catch (Exception ex)
            {
                return ApiResponse<List<StockTransferDTO>>.Fail(message: $"Error retrieving stock transfer history: {ex.Message}");
            }
        }

        public async Task<ApiResponse<ProductStockDTO>> GetProductByBarcodeAsync(int companyId, string barcode)
        {
            try
            {
                var company = await _context.Companies.FindAsync(companyId);
                if (company == null)
                    return ApiResponse<ProductStockDTO>.Fail(message: "Company not found");

                // Find the product by barcode
                var product = await _context.Products
                    .FirstOrDefaultAsync(p => p.CompanyId == companyId && p.Barcode == barcode);

                if (product == null)
                    return ApiResponse<ProductStockDTO>.Fail(message: "Product not found with the given barcode");

                // Get all batches for this product
                var batches = await _context.ProductBatches
                    .Include(b => b.Warehouse)
                    .Where(b => b.ProductId == product.Id)
                    .ToListAsync();

                // Calculate total stock and stock by warehouse
                var totalStock = batches.Sum(b => b.Quantity);
                var stockByWarehouse = batches
                    .GroupBy(b => b.WarehouseId)
                    .ToDictionary(
                        g => g.First().Warehouse.Name,
                        g => g.Sum(b => b.Quantity)
                    );

                // Create and return the product stock DTO
                var productStockDTO = new ProductStockDTO
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    Sku = product.Sku,
                    Barcode = product.Barcode,
                    Price = product.Price,
                    IsPerishable = product.IsPerishable,
                    TotalStock = totalStock,
                    StockByWarehouse = stockByWarehouse
                };

                return ApiResponse<ProductStockDTO>.Ok(productStockDTO);
            }
            catch (Exception ex)
            {
                return ApiResponse<ProductStockDTO>.Fail(message: $"Error retrieving product by barcode: {ex.Message}");
            }
        }

        // Helper methods
        private async Task<ProductBatchDTO> MapToProductBatchDTO(ProductBatch batch)
        {
            // Ensure related entities are loaded
            if (batch.Product == null)
                batch.Product = await _context.Products.FindAsync(batch.ProductId) ?? new Product();

            if (batch.Warehouse == null)
                batch.Warehouse = await _context.Warehouses.FindAsync(batch.WarehouseId) ?? new Warehouse();

            if (batch.Company == null)
                batch.Company = await _context.Companies.FindAsync(batch.CompanyId) ?? new Company();

            return new ProductBatchDTO
            {
                Id = batch.Id,
                UUID = batch.UUID,
                CreatedOn = batch.CreatedOn,
                UpdatedOn = batch.UpdatedOn,
                CompanyId = batch.CompanyId,
                CompanyName = batch.Company.Name,
                ProductId = batch.ProductId,
                ProductName = batch.Product.Name,
                ProductSku = batch.Product.Sku,
                WarehouseId = batch.WarehouseId,
                WarehouseName = batch.Warehouse.Name,
                Quantity = batch.Quantity,
                ExpiryDate = batch.ExpiryDate
            };
        }

        private async Task CreateExpiryNotification(ProductBatch batch, int daysUntilExpiry)
        {
            if (batch.Product == null)
                batch.Product = await _context.Products.FindAsync(batch.ProductId) ?? new Product();

            if (batch.Warehouse == null)
                batch.Warehouse = await _context.Warehouses.FindAsync(batch.WarehouseId) ?? new Warehouse();

            string title;
            NotificationType type;

            if (daysUntilExpiry <= 0)
            {
                title = $"EXPIRED: {batch.Product.Name} in {batch.Warehouse.Name}";
                type = NotificationType.ERROR;
            }
            else if (daysUntilExpiry <= 7)
            {
                title = $"URGENT: {batch.Product.Name} expires in {daysUntilExpiry} days";
                type = NotificationType.WARNING;
            }
            else
            {
                title = $"{batch.Product.Name} expires in {daysUntilExpiry} days";
                type = NotificationType.INFO;
            }

            var message = $"{batch.Quantity} units in {batch.Warehouse.Name} warehouse will expire on {batch.ExpiryDate:yyyy-MM-dd}";

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                    title: title,
                    message: message,
                    isSuperAdmin: true,
                    type: type
                ));
        }
    }
}