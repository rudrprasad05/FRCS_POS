using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IWarehouseRepository
    {
        public Task<ApiResponse<WarehouseDTO>> CreateAsync(NewWarehouseRequest request);
        public Task<ApiResponse<List<WarehouseDTO>>> GetAllAsync(RequestQueryObject requestQueryObject);
        public Task<ApiResponse<WarehouseDTO>> GetOneAsync(RequestQueryObject requestQueryObject);
        public Task<ApiResponse<WarehouseDTO>> SoftDeleteAsync(string uuid);

    }
}