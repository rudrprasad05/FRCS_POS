using FrcsPos.Context;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Mappers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using FrcsPos.Interfaces;

namespace FrcsPos.Services
{
    public class WarehouseService : IWarehouseService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<IWarehouseService> _logger;

        public WarehouseService(ApplicationDbContext context, ILogger<IWarehouseService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<List<WarehouseDTO>>> GetAllAsync(int companyId)
        {
            var warehouses = await _context.Warehouses
                .Where(w => w.CompanyId == companyId)
                .ToListAsync();

            var dtoList = warehouses.FromModelToDto();

            return new ApiResponse<List<WarehouseDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = dtoList,
                Meta = new MetaData
                {
                    TotalCount = dtoList.Count,
                }
            };
        }

        public async Task<ApiResponse<WarehouseDTO>> GetByIdAsync(int id)
        {
            var warehouse = await _context.Warehouses.FindAsync(id);
            if (warehouse == null)
                return ApiResponse<WarehouseDTO>.NotFound(logger: _logger);

            return ApiResponse<WarehouseDTO>.Ok(warehouse.FromModelToDto(), logger: _logger);
        }

        public async Task<ApiResponse<WarehouseDTO>> CreateAsync(WarehouseRequest request)
        {
            // Check if the company exists
            var companyExists = await _context.Companies.AnyAsync(c => c.Id == request.CompanyId);
            if (!companyExists)
            {
                return ApiResponse<WarehouseDTO>.Fail(message: "Company not found.", logger: _logger);
            }

            var exists = await _context.Warehouses
                .FirstOrDefaultAsync(w => w.Name == request.Name && w.CompanyId == request.CompanyId);

            if (exists != null)
                return ApiResponse<WarehouseDTO>.Fail(message: "Warehouse already exists", logger: _logger);

            var warehouse = new Warehouse
            {
                Name = request.Name,
                Location = request.Location,
                CompanyId = request.CompanyId,
                CreatedOn = DateTime.UtcNow
            };

            try
            {
                _context.Warehouses.Add(warehouse);
                await _context.SaveChangesAsync();
                return ApiResponse<WarehouseDTO>.Ok(warehouse.FromModelToDto(), message: "Warehouse created", logger: _logger);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Failed to create warehouse due to a database error.");
                return ApiResponse<WarehouseDTO>.Fail(message: "Failed to create warehouse.", logger: _logger);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while creating a warehouse.");
                return ApiResponse<WarehouseDTO>.Fail(message: "An unexpected error occurred.", logger: _logger);
            }
        }

        public async Task<ApiResponse<WarehouseDTO>> UpdateAsync(int id, WarehouseRequest request)
        {
            var warehouse = await _context.Warehouses.FindAsync(id);
            if (warehouse == null)
                return ApiResponse<WarehouseDTO>.NotFound(logger: _logger);

            warehouse.Name = request.Name;
            warehouse.Location = request.Location;
            warehouse.CompanyId = request.CompanyId;
            warehouse.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse<WarehouseDTO>.Ok(warehouse.FromModelToDto(), message: "Warehouse updated", logger: _logger);
        }

        public async Task<ApiResponse<bool>> DeleteAsync(int id)
        {
            var warehouse = await _context.Warehouses.FindAsync(id);
            if (warehouse == null)
                return ApiResponse<bool>.NotFound(logger: _logger);

            _context.Warehouses.Remove(warehouse);
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.Ok(true, message: "Warehouse deleted", logger: _logger);
        }
    }
}