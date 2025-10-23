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
        public Task<ApiResponse<ProductDTO>> UpdateProductAsync(ProductRequest request, RequestQueryObject queryObject);
        public Task<ApiResponse<ProductDTO>> GetProductByUUID(string uuid);
        public Task<ApiResponse<List<ProductVariantDTO>>> GetAllProductsVariants(RequestQueryObject queryObject, bool isForPos = false);
        public Task<ApiResponse<ProductVariantDTO>> GetProductByBarcode(RequestQueryObject queryObject);
        public Task<ApiResponse<ProductDTO>> SoftDelete(RequestQueryObject queryObject);
        public Task<ApiResponse<ProductDTO>> Activate(RequestQueryObject queryObject);
        public Task<ApiResponse<InitialProductCreationData>> GetCreationInfoAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<ProductEditInfo>> GetProductEditPageAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<ProductDTO>> CreateProductAsync(ProductRequest request, RequestQueryObject queryObject);



    }
}