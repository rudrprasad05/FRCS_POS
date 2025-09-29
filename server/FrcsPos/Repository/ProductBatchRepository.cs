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
    public class ProductBatchRepository : IProductBatchRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IMediaRepository _mediaRepository;
        private readonly IUserContext _userContext;

        public ProductBatchRepository(
           ApplicationDbContext applicationDbContext,
           INotificationService notificationService,
           IMediaRepository mediaRepository,
            IUserContext userContext
        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;
            _mediaRepository = mediaRepository;
            _userContext = userContext;
        }

        public async Task<ApiResponse<ProductBatchDTO>> CreateAsync(NewProductBatchRequest request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == request.CompanyId);
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId);
            var wh = await _context.Warehouses.FirstOrDefaultAsync(w => w.UUID == request.WarehouseId);

            if (company == null || product == null || wh == null)
            {
                return ApiResponse<ProductBatchDTO>.Fail(message: "invalid params");
            }

            if (!wh.IsActive)
            {
                return ApiResponse<ProductBatchDTO>.Fail(message: "Activate warehouse first");
            }

            var newModel = new ProductBatch
            {
                CompanyId = company.Id,
                ProductVariantId = product.Id,
                WarehouseId = wh.Id,
                Quantity = request.Quantity,
                ExpiryDate = request.ExpiryDate,
            };

            var model = await _context.ProductBatches.AddAsync(newModel);
            await _context.SaveChangesAsync();

            var result = model.Entity.FromModelToDto();

            var userNotification = new NotificationDTO
            {
                Title = "New batch",
                Message = "A new batch for product " + product.Name + " was created",
                Type = NotificationType.SUCCESS,
                ActionUrl = $"/{company.Name}/warehouse/${wh.UUID}/batch/${newModel.UUID}/view",
                IsSuperAdmin = false,
                CompanyId = company.Id,
                UserId = _userContext.UserId
            };

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(userNotification));

            return new ApiResponse<ProductBatchDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
            };
        }

        public async Task<ApiResponse<List<ProductBatchDTO>>> GetAllAsycn(RequestQueryObject queryObject)
        {
            var query = _context.ProductBatches
                .Include(p => p.ProductVariant.Product)
                .Where(p => p.Warehouse.UUID == queryObject.UUID)
                .AsQueryable();

            // filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryObject.Search))
            {
                var search = queryObject.Search.ToLower();
                query = query.Where(c =>
                    c.ProductVariant.Product.Name.ToLower().Contains(search) ||
                    c.ProductVariant.Product.Sku.ToLower().Contains(search)
                );
            }

            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var products = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<ProductBatchDTO>();
            foreach (var product in products)
            {
                var dto = product.FromModelToDto();
                result.Add(dto);
            }

            return new ApiResponse<List<ProductBatchDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = queryObject.PageNumber,
                    PageSize = queryObject.PageSize
                }
            };
        }

        public Task<ApiResponse<ProductBatchDTO>> GetByUUID(RequestQueryObject queryObject)
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse<LoadPreCreationInfo>> GetCreationInfoAsync(RequestQueryObject queryObject)
        {
            if (queryObject == null || string.IsNullOrEmpty(queryObject.CompanyName))
            {
                return ApiResponse<LoadPreCreationInfo>.Fail(message: "malformed url");
            }

            var company = await _context.Companies
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Name == queryObject.CompanyName);
            if (company == null)
            {
                return ApiResponse<LoadPreCreationInfo>.Fail(message: "company not NotFound");
            }

            var warehouse = await _context.Warehouses
                .Where(c => c.CompanyId == company.Id)
                .ToListAsync();


            var dto = new LoadPreCreationInfo
            {
                Company = company.FromModelToDto(),
                Warehouses = warehouse.FromModelToDto(),
                Products = company.Products.ToList().FromModelToDto(),
            };

            return ApiResponse<LoadPreCreationInfo>.Ok(dto);
        }

        public Task<ApiResponse<ProductBatchDTO>> SoftDeleteAsync(RequestQueryObject queryObject)
        {
            throw new NotImplementedException();
        }
    }
}