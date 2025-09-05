using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IProductRepository
    {
        public Task<ApiResponse<ProductDTO>> CreateProductAsync(NewProductRequest request);
        public Task<ApiResponse<ProductDTO>> GetProductByUUID(string uuid);
        public Task<ApiResponse<List<ProductDTO>>> GetAllProducts(RequestQueryObject queryObject);
        public Task<ApiResponse<ProductDTO>> SoftDelete(string uuid);
        public Task<ApiResponse<InitialProductCreationData>> GetCreationInfoAsync();
        public Task<ApiResponse<ProductEditInfo>> GetProductEditPageAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<ProductDTO>> EditProductAsync(RequestQueryObject queryObject, EditProductRequest request);



    }
}