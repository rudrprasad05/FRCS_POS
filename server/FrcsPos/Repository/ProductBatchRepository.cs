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


        public ProductBatchRepository(
           ApplicationDbContext applicationDbContext,
           INotificationService notificationService,
           IMediaRepository mediaRepository

        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;
            _mediaRepository = mediaRepository;

        }

        public Task<ApiResponse<ProductBatchDTO>> CreateAsync(NewProductRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<List<ProductBatchDTO>>> GetAllAsycn(RequestQueryObject queryObject)
        {
            throw new NotImplementedException();
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