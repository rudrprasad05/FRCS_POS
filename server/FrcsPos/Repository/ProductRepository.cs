using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
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
        private readonly IAzureBlobService _azureBlobService;

        private readonly IMediaRepository _mediaRepository;
        private readonly IUserContext _userContext;
        private readonly IRedisCacheService _redisCacheService;


        public ProductRepository(
            IAzureBlobService azureBlobService,
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
            _azureBlobService = azureBlobService;

        }



        public async Task<ApiResponse<List<ProductDTO>>> GetAllProducts(RequestQueryObject queryObject, bool isForPos = false)
        {
            var now = DateTime.UtcNow;
            var query = _context.Products
                .Include(p => p.TaxCategory)
                .Include(p => p.Variants)
                    .ThenInclude(p => p.Media)
                .Where(p => p.Company.Name == queryObject.CompanyName)
                .AsQueryable();

            if (isForPos)
            {
                // query = query.Where(p => p.Batches.Any(b => b.Quantity > 0 && (b.ExpiryDate == null || b.ExpiryDate > now)));
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
                    c.Sku.ToLower().Contains(search)
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

                // dto.MaxStock = product.Batches
                //     .Where(b => b.Quantity > 0 && (b.ExpiryDate == null || b.ExpiryDate > now))
                //     .Sum(b => b.Quantity);
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

        public async Task<ApiResponse<List<ProductVariantDTO>>> GetAllProductsVariants(RequestQueryObject queryObject, bool isForPos = false)
        {
            var now = DateTime.UtcNow;
            var query = _context.ProductVariants
                .Include(p => p.Product.TaxCategory)
                .Include(p => p.Media)
                .Where(p => p.Product.Company.Name == queryObject.CompanyName)
                .AsQueryable();

            if (isForPos)
            {
                // query = query.Where(p => p.Batches.Any(b => b.Quantity > 0 && (b.ExpiryDate == null || b.ExpiryDate > now)));
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
                    c.Sku.ToLower().Contains(search)
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
            var result = new List<ProductVariantDTO>();
            foreach (var product in products)
            {
                var dto = product.FromModelToDto();

                dto.MaxStock = product.Batches
                    .Where(b => b.Quantity > 0 && (b.ExpiryDate == null || b.ExpiryDate > now))
                    .Sum(b => b.Quantity);

                if (dto.Media != null)
                {
                    var signedUrl = await _azureBlobService.GetImageSignedUrl(dto.Media.ObjectKey ?? "");
                    dto.Media.Url = signedUrl;
                }

                result.Add(dto);
            }

            return new ApiResponse<List<ProductVariantDTO>>
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

            product.IsPerishable = request.IsPerishable;
            product.TaxCategoryId = request.TaxCategoryId;

            product.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var productDto = product.FromModelToDto();

            return ApiResponse<ProductDTO>.Ok(productDto);
        }

        public async Task<ApiResponse<ProductDTO>> CreateProductAsync(ProductRequest request, RequestQueryObject queryObject)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            var productData = JsonSerializer.Deserialize<NewProdJson>(request.Product, options);
            if (productData == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "malformed product data. could not understand product");
            }

            var company = await _context.Companies.FirstOrDefaultAsync(x => x.Name == queryObject.CompanyName);
            if (company == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "invalid company");
            }

            var tax = await _context.TaxCategories.FirstOrDefaultAsync(x => x.UUID == productData.TaxCategoryId);
            if (tax == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "invalid tax");
            }

            var sup = await _context.Suppliers.FirstOrDefaultAsync(x => x.UUID == productData.SupplierId);
            if (sup == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "invalid supplier");
            }

            var dup = await _context.Products.FirstOrDefaultAsync(x => x.Sku == productData.Sku);
            if (dup != null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "duplicate SKU");
            }

            // Create product
            var product = new Product
            {
                Name = productData.Name,
                Sku = productData.Sku,

                TaxCategoryId = tax.Id,
                CompanyId = company.Id,
                SupplierId = sup.Id,

                IsPerishable = productData.IsPerishable,
                FirstWarningInDays = productData.IsPerishable ? productData.FirstWarningInDays : null,
                CriticalWarningInHours = productData.IsPerishable ? productData.CriticalWarningInHours : null
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();


            // Process variants
            for (int i = 0; i < request.Variants.Count; i++)
            {
                var variantData = JsonSerializer.Deserialize<NewVarData>(request.Variants[i], options);
                if (variantData == null)
                {
                    return ApiResponse<ProductDTO>.Fail(message: "malformed variant data");
                }

                var variant = new ProductVariant
                {
                    ProductId = product.Id,
                    Name = variantData.Name,
                    Sku = variantData.Sku,
                    Barcode = variantData.Barcode,
                    Price = variantData.Price,
                    FirstWarningInDays = product.FirstWarningInDays,
                    CriticalWarningInHours = product.CriticalWarningInHours
                };

                if (request.VariantFiles != null && request.VariantFiles.Count > i)
                {
                    var file = request.VariantFiles[i];
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
                    variant.MediaId = newMedia.Data?.Id;
                }

                _context.ProductVariants.Add(variant);
            }

            await _context.SaveChangesAsync();

            return ApiResponse<ProductDTO>.Ok(product.FromModelToDto());
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
                .Include(p => p.Variants)
                .Include(p => p.Supplier)
                .Include(p => p.TaxCategory)
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

        public async Task<ApiResponse<InitialProductCreationData>> GetCreationInfoAsync(RequestQueryObject queryObject)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(p => p.Name == queryObject.CompanyName);
            if (company == null)
            {
                return ApiResponse<InitialProductCreationData>.NotFound();
            }

            var suppliers = await _context.Suppliers
                .Where(p => p.Company.Id == company.Id)
                .ToListAsync();

            var taxes = await _context.TaxCategories.Where(x => x.IsActive && !x.IsDeleted).ToListAsync();

            var dto = new InitialProductCreationData
            {
                Suppliers = suppliers.FromModelToDto(),
                TaxCategories = taxes.FromModelToDto(),
            };

            return ApiResponse<InitialProductCreationData>.Ok(dto);
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

        // was doing this
        public async Task<ApiResponse<ProductDTO>> UpdateProductAsync(ProductRequest request, RequestQueryObject queryObject)
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var product = await _context.Products.FirstOrDefaultAsync(x => x.UUID == queryObject.UUID);
            if (product == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "malformed product url. could not understand product");
            }

            var productData = JsonSerializer.Deserialize<NewProdJson>(request.Product, options);
            if (productData == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "malformed product data. could not understand product");
            }

            var company = await _context.Companies.FirstOrDefaultAsync(x => x.Name == queryObject.CompanyName);
            if (company == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "invalid company");
            }

            var tax = await _context.TaxCategories.FirstOrDefaultAsync(x => x.UUID == productData.TaxCategoryId);
            if (tax == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "invalid tax");
            }

            var sup = await _context.Suppliers.FirstOrDefaultAsync(x => x.UUID == productData.SupplierId);
            if (sup == null)
            {
                return ApiResponse<ProductDTO>.Fail(message: "invalid supplier");
            }

            // Create product
            product.SupplierId = sup.Id;
            product.TaxCategoryId = tax.Id;
            product.Name = productData.Name;
            product.Sku = productData.Sku;
            product.IsPerishable = productData.IsPerishable;
            product.UpdatedOn = DateTime.UtcNow;

            if (productData.IsPerishable)
            {
                product.FirstWarningInDays = productData.FirstWarningInDays;
                product.CriticalWarningInHours = productData.CriticalWarningInHours;
            }
            else
            {
                product.FirstWarningInDays = null;
                product.CriticalWarningInHours = null;
            }

            await _context.SaveChangesAsync();


            // // Process variants
            // for (int i = 0; i < request.Variants.Count; i++)
            // {
            //     var variantData = JsonSerializer.Deserialize<NewVarData>(request.Variants[i], options);
            //     if (variantData == null)
            //     {
            //         return ApiResponse<ProductDTO>.Fail(message: "malformed variant data");
            //     }

            //     var variant = new ProductVariant
            //     {
            //         ProductId = productModel.Id,
            //         Name = variantData.Name,
            //         Sku = variantData.Sku,
            //         Barcode = variantData.Barcode,
            //         Price = variantData.Price,
            //         FirstWarningInDays = productModel.FirstWarningInDays,
            //         CriticalWarningInHours = productModel.CriticalWarningInHours
            //     };

            //     if (request.VariantFiles != null && request.VariantFiles.Count > i)
            //     {
            //         var file = request.VariantFiles[i];
            //         var mediaToBeCreated = new Media
            //         {
            //             AltText = file.FileName,
            //             FileName = file.FileName,
            //             ShowInGallery = true,
            //         };

            //         if (file != null)
            //         {
            //             mediaToBeCreated.SizeInBytes = file.Length;
            //             mediaToBeCreated.ContentType = file.ContentType;
            //         }

            //         var newMedia = await _mediaRepository.CreateAsync(mediaToBeCreated, file: file);
            //         variant.MediaId = newMedia.Data?.Id;
            //     }

            //     _context.ProductVariants.Add(variant);
            // }

            // await _context.SaveChangesAsync();

            return ApiResponse<ProductDTO>.Ok(product.FromModelToDto());
        }

        public Task<ApiResponse<ProductDTO>> GetProductByUUID(string uuid)
        {
            throw new NotImplementedException();
        }
    }
}