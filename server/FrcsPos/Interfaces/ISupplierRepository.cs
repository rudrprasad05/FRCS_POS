using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface ISupplierRepository
    {
        public Task<ApiResponse<SupplierDTO>> CreateAsync(NewSupplierRequest request);
        public Task<ApiResponse<SupplierDTO>> EditAsync(EditSupplierData request, RequestQueryObject requestQueryObject);
        public Task<ApiResponse<List<SupplierDTO>>> GetAllAsync(RequestQueryObject requestQueryObject);
        public Task<ApiResponse<SupplierDTO>> GetOneAsync(RequestQueryObject requestQueryObject);
        public Task<ApiResponse<SupplierDTO>> SoftDeleteAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<SupplierDTO>> Activate(RequestQueryObject queryObject);


    }
}