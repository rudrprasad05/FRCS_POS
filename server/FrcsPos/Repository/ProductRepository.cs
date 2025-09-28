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
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IMediaRepository _mediaRepository;
        private readonly IUserContext _userContext;
        private readonly IRedisCacheService _redisCacheService;


        public ProductRepository(
           ApplicationDbContext applicationDbContext,
           INotificationService notificationService,
           IMediaRepository mediaRepository,
           IRedisCacheService redisCacheService,
            IUserContext userContext

        )
        {
            _userContext = userContext;
            _context = applicationDbContext;
            _notificationService = notificationService;
            _mediaRepository = mediaRepository;
            _redisCacheService = redisCacheService;
        }

        public async Task<ApiResponse<ProductDTO>> CreateProductAsync(NewProductRequest request)
        {

            var existsSKU = await _context.Products.AnyAsync(p => p.Sku == request.SKU);
            if (existsSKU != false)
            {
                return ApiResponse<ProductDTO>.Fail(message: "Duplicate SKU");
            }

            var existsBarcode = await _context.Products.AnyAsync(p => p.Barcode == request.Barcode);
            if (existsBarcode != false)
            {
                return ApiResponse<ProductDTO>.Fail(message: "Duplicate Barcode");
            }

            var file = request.File;
            if (file == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "Missing file");
            }
            var mediaToBeCreated = new Media
            {
                AltText = file.FileName,
                FileName = file.FileName,
                ShowInGallery = true,
            };

            if (file != null)
            {
                mediaToBeCreated.SizeInBytes = file.Length;
                mediaToBeCreated.ContentType = file.ContentType;
            }

            var newMedia = await _mediaRepository.CreateAsync(mediaToBeCreated, file: file);
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Name == request.CompanyName);

            if (company == null || newMedia == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "null company or media");
            }

            var modelToBeCreated = new Product
            {
                Name = request.ProductName,
                CompanyId = company.Id,
                Sku = request.SKU,

                Barcode = request.Barcode,
                Price = request.Price,
                TaxCategoryId = request.TaxCategoryId,
                IsPerishable = request.IsPerishable,
                MediaId = newMedia.Data?.Id
            };

            var model = await _context.Products.AddAsync(modelToBeCreated);
            await _context.SaveChangesAsync();

            var result = model.Entity.FromModelToDto();
            var notification = new NotificationDTO
            {
                Title = "New Product",
                Message = $"The product '{result.Name}' was created",
                Type = NotificationType.SUCCESS,
                ActionUrl = $"/{company.Name}/products/{result.UUID}",
                IsSuperAdmin = false,
                CompanyId = company.Id,
                UserId = _userContext.UserId

            };
            FireAndForget.Run(_notificationService.CreateBackgroundNotification(notification));


            return ApiResponse<ProductDTO>.Ok(data: result);
        }

        public async Task<ApiResponse<List<ProductDTO>>> GetAllProducts(RequestQueryObject queryObject, bool isForPos = false)
        {
            var now = DateTime.UtcNow;
            var query = _context.Products
                .Include(p => p.TaxCategory)
                .Include(p => p.Media)
                .Include(p => p.Batches)
                .Where(p => p.Company.Name == queryObject.CompanyName)
                .AsQueryable();

            if (isForPos)
            {
                query = query.Where(p => p.Batches.Any(b => b.Quantity > 0 && (b.ExpiryDate == null || b.ExpiryDate > now)));
                query = query.Where(p => p.IsDeleted != true);

            }
            // filtering
            if (queryObject.IsDeleted.HasValue && !isForPos)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryObject.Search))
            {
                var search = queryObject.Search.ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(search) ||
                    c.Sku.ToLower().Contains(search) ||
                    c.Barcode.ToLower().Contains(search) ||
                    c.Price.ToString().Contains(search)
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
            var result = new List<ProductDTO>();
            foreach (var product in products)
            {
                var dto = product.FromModelToDto();
                result.Add(dto);

                dto.MaxStock = product.Batches
                    .Where(b => b.Quantity > 0 && (b.ExpiryDate == null || b.ExpiryDate > now))
                    .Sum(b => b.Quantity);


            }

            return new ApiResponse<List<ProductDTO>>
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
        public async Task<ApiResponse<ProductDTO>> EditProductAsync(RequestQueryObject queryObject, EditProductRequest request)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (product == null)
            {
                return ApiResponse<ProductDTO>.NotFound();
            }

            var mediaId = 0;

            if (request.File != null)
            {
                var mediaToBeCreated = new Media
                {
                    AltText = request.File.FileName,
                    FileName = request.File.FileName,
                    ShowInGallery = true,
                };

                mediaToBeCreated.SizeInBytes = request.File.Length;
                mediaToBeCreated.ContentType = request.File.ContentType;


                var newMedia = await _mediaRepository.CreateAsync(mediaToBeCreated, file: request.File);
                if (newMedia.Data != null)
                {
                    mediaId = newMedia.Data.Id;
                }
            }
            else
            {
                mediaId = request.MediaId;
            }
            // Update fields
            product.Name = request.ProductName;
            product.Sku = request.SKU;
            product.Barcode = request.Barcode;
            product.Price = request.Price;
            product.IsPerishable = request.IsPerishable;
            product.TaxCategoryId = request.TaxCategoryId;
            product.MediaId = mediaId;

            product.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var productDto = product.FromModelToDto();

            return ApiResponse<ProductDTO>.Ok(productDto);
        }


        public async Task<ApiResponse<ProductEditInfo>> GetProductEditPageAsync(RequestQueryObject queryObject)
        {
            var cacheKey = $"product:{queryObject.UUID}";
            var cached = await _redisCacheService.GetAsync<ProductEditInfo>(cacheKey);
            if (cached != null)
            {
                return ApiResponse<ProductEditInfo>.Ok(cached);
            }


            var product = await _context.Products
                .Include(p => p.Media)
                .FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (product == null)
            {
                return ApiResponse<ProductEditInfo>.NotFound();
            }

            var allTaxes = await _context.TaxCategories
                .Where(t => t.IsDeleted != true)
                .ToListAsync();

            var dto = new ProductEditInfo
            {
                Product = product.FromModelToDto(),
                TaxCategories = allTaxes.FromModelToDto()
            };

            FireAndForget.Run(_redisCacheService.SetAsync(cacheKey, dto, TimeSpan.FromMinutes(5)));
            return ApiResponse<ProductEditInfo>.Ok(dto);
        }


        public Task<ApiResponse<ProductDTO>> GetProductByUUID(string uuid)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<InitialProductCreationData>> GetCreationInfoAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<ApiResponse<ProductDTO>> SoftDelete(RequestQueryObject queryObject)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (product == null)
            {
                return ApiResponse<ProductDTO>.NotFound();
            }

            product.IsDeleted = true;
            product.UpdatedOn = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            var productDto = product.FromModelToDto();

            return ApiResponse<ProductDTO>.Ok(productDto);
        }

        public async Task<ApiResponse<ProductDTO>> Activate(RequestQueryObject queryObject)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (product == null)
            {
                return ApiResponse<ProductDTO>.NotFound();
            }

            product.IsDeleted = false;
            product.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var productDto = product.FromModelToDto();

            return ApiResponse<ProductDTO>.Ok(productDto);
        }
    }
}