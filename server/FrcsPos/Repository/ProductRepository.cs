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
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IMediaRepository _mediaRepository;


        public ProductRepository(
           ApplicationDbContext applicationDbContext,
           INotificationService notificationService,
           IMediaRepository mediaRepository

        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;
            _mediaRepository = mediaRepository;

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
            FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                title: "New Product",
                message: $"The product '{result.Name}' was created",
                type: NotificationType.SUCCESS,
                actionUrl: $"/{company.Name}/products/{result.UUID}",
                isSuperAdmin: false,
                companyId: company.Id
            ));


            return ApiResponse<ProductDTO>.Ok(data: result);
        }

        public async Task<ApiResponse<List<ProductDTO>>> GetAllProducts(RequestQueryObject queryObject)
        {
            var query = _context.Products
                .Include(p => p.Media)
                .Include(p => p.Batches)
                .AsQueryable();

            // filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
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

        public Task<ApiResponse<ProductDTO>> GetProductByUUID(string uuid)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<InitialProductCreationData>> GetCreationInfoAsync()
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<ProductDTO>> SoftDelete(string uuid)
        {
            throw new NotImplementedException();
        }
    }
}