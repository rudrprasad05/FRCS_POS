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
        private readonly IProductMapper _productMapper;
        private readonly IProductVariantMapper _productVariantMapper;



        public ProductBatchRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService,
            IMediaRepository mediaRepository,
            IUserContext userContext,
            IProductMapper productMapper,
            IProductVariantMapper productVariantMapper

        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;
            _mediaRepository = mediaRepository;
            _userContext = userContext;
            _productMapper = productMapper;
            _productVariantMapper = productVariantMapper;
        }

        public async Task<ApiResponse<ProductBatchDTO>> ActivateAsync(RequestQueryObject queryObject)
        {
            var product = await _context.ProductBatches
               .FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (product == null)
            {
                return ApiResponse<ProductBatchDTO>.NotFound();
            }

            product.IsDeleted = false;
            product.IsActive = true;
            product.UpdatedOn = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            return ApiResponse<ProductBatchDTO>.Ok(product.FromModelToDto());
        }

        public async Task<ApiResponse<ProductBatchDTO>> CreateAsync(NewProductBatchRequest request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Name == request.CompanyName);
            var product = await _context.ProductVariants.FirstOrDefaultAsync(p => p.UUID == request.ProductId);
            var supp = await _context.Suppliers.FirstOrDefaultAsync(p => p.UUID == request.SupplierId);
            var wh = await _context.Warehouses.FirstOrDefaultAsync(w => w.UUID == request.WarehouseId);

            if (company == null || product == null || wh == null || supp == null)
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
                SupplierId = supp.Id,
                Quantity = request.Quantity,
                ExpiryDate = request.ExpiryDate ?? null,
                RecievedDate = request.ReceiveDate
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

        public async Task<ApiResponse<ProductBatchDTO>> EditAsync(EditProductBatchRequest request)
        {
            var batch = await _context.ProductBatches
            .Include(x => x.ProductVariant)
            .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(c => c.UUID == request.BatchId);
            if (batch == null)
            {
                return ApiResponse<ProductBatchDTO>.Fail(message: "invalid params");
            }

            batch.Quantity = request.Quantity;
            batch.RecievedDate = request.ReceivedDate;
            batch.UpdatedOn = DateTime.UtcNow;

            if (batch.ProductVariant.Product.IsPerishable)
            {
                batch.ExpiryDate = request.ExpiryDate;

                if (batch.ExpiryDate < batch.RecievedDate)
                {
                    return ApiResponse<ProductBatchDTO>.Fail(message: "batch expires before receive date");
                }
            }
            else
            {
                batch.ExpiryDate = null;
            }



            await _context.SaveChangesAsync();

            return new ApiResponse<ProductBatchDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = batch.FromModelToDto(),
            };
        }

        public async Task<ApiResponse<List<ProductBatchDTO>>> GetAllAsycn(RequestQueryObject queryObject)
        {
            var query = _context.ProductBatches
                .Include(p => p.ProductVariant)
                    .ThenInclude(x => x.Media)
                .Include(p => p.ProductVariant)
                    .ThenInclude(x => x.Product)
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
                return ApiResponse<LoadPreCreationInfo>.Fail(message: "Malformed url");
            }

            var company = await _context.Companies
                .Include(c => c.Suppliers
                    .Where(x => x.IsActive && !x.IsDeleted
                ))
                .Include(c => c.Products)
                    .ThenInclude(p => p.Variants
                        .Where(x => x.IsActive && !x.IsDeleted
                    ))
                .FirstOrDefaultAsync(c => c.Name == queryObject.CompanyName);

            if (company == null)
            {
                return ApiResponse<LoadPreCreationInfo>.Fail(message: "Company not found");
            }

            var warehouses = await _context.Warehouses
                .Where(c => c.CompanyId == company.Id)
                .ToListAsync();

            var productsQuery = company.Products.AsQueryable();

            if (!string.IsNullOrEmpty(queryObject.UUID))
            {
                if (!string.IsNullOrEmpty(queryObject.UUID))
                {
                    productsQuery = productsQuery.Where(p => p.Supplier.UUID == queryObject.UUID);
                }
            }

            var variants = await _productVariantMapper.FromModelToDtoAsync(
                productsQuery.SelectMany(x => x.Variants).ToList()
            );


            var dto = new LoadPreCreationInfo
            {
                Company = company.FromModelToDto(),
                Suppliers = company.Suppliers.FromModelToDto(),
                Warehouses = warehouses.FromModelToDto(),
                Products = variants
            };

            return ApiResponse<LoadPreCreationInfo>.Ok(dto);
        }

        public async Task<ApiResponse<ProductBatchDTO>> GetOneByUUID(RequestQueryObject queryObject)
        {
            var batch = await _context.ProductBatches
                .Include(x => x.ProductVariant)
                    .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.UUID == queryObject.UUID && x.Company.Name == queryObject.CompanyName);
            if (batch == null)
            {
                return ApiResponse<ProductBatchDTO>.NotFound();
            }

            return ApiResponse<ProductBatchDTO>.Ok(batch.FromModelToDto());
        }

        public async Task<ApiResponse<ProductBatchDTO>> SoftDeleteAsync(RequestQueryObject queryObject)
        {
            var product = await _context.ProductBatches
                .FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (product == null)
            {
                return ApiResponse<ProductBatchDTO>.NotFound();
            }

            product.IsDeleted = true;
            product.IsActive = false;
            product.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse<ProductBatchDTO>.Ok(product.FromModelToDto());
        }
    }
}