using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IProductBatchRepository
    {
        public Task<ApiResponse<ProductBatchDTO>> CreateAsync(NewProductBatchRequest request);
        public Task<ApiResponse<ProductBatchDTO>> GetByUUID(RequestQueryObject queryObject);
        public Task<ApiResponse<List<ProductBatchDTO>>> GetAllAsycn(RequestQueryObject queryObject);
        public Task<ApiResponse<ProductBatchDTO>> SoftDeleteAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<LoadPreCreationInfo>> GetCreationInfoAsync(RequestQueryObject queryObject);

    }
}