using FrcsPos.Context;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Mappers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FrcsPos.Interfaces
{
    public interface IWarehouseService
    {
        
        public Task<ApiResponse<List<WarehouseDTO>>> GetAllAsync(int companyId);
        public Task<ApiResponse<WarehouseDTO>> GetByIdAsync(int id);
        public Task<ApiResponse<WarehouseDTO>> CreateAsync(WarehouseRequest request);
        public Task<ApiResponse<WarehouseDTO>> UpdateAsync(int id, WarehouseRequest request);
        public Task<ApiResponse<bool>> DeleteAsync(int id);
    }
}