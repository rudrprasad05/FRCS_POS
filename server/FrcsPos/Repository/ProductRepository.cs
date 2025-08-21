using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Repository
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public ProductRepository(
           ApplicationDbContext applicationDbContext,
           INotificationService notificationService

       )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;


        }

        public Task<ApiResponse<ProductDTO>> CreateProductAsync(NewCompanyRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<ProductDTO>> GetAllProducts(RequestQueryObject queryObject)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<ProductDTO>> GetProductByUUID(string uuid)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<ProductDTO>> SoftDelete(string uuid)
        {
            throw new NotImplementedException();
        }
    }
}