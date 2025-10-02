using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Models;
using FrcsPos.Response.DTO;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class TaxCategoryRepository : ITaxCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public TaxCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<List<TaxCategoryDTO>>> GetAllTaxCategories(RequestQueryObject queryObject)
        {
            var query = _context.TaxCategories.AsQueryable();

            if (queryObject.IsDeleted.HasValue)
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);

            var totalCount = await query.CountAsync();
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

            var taxCategories = await query.Skip(skip).Take(queryObject.PageSize).ToListAsync();
            var result = taxCategories.Select(t => t.FromModelToDto()).ToList();

            return new ApiResponse<List<TaxCategoryDTO>> { Success = true, StatusCode = 200, Data = result };
        }

        public async Task<ApiResponse<TaxCategoryDTO>> CreateTaxCategoryAsync(NewTaxRequest request)
        {
            var model = new TaxCategory
            {
                Name = request.Name,
                RatePercent = request.Percentage,
                CreatedOn = DateTime.UtcNow,
                IsDeleted = false
            };

            await _context.TaxCategories.AddAsync(model);
            await _context.SaveChangesAsync();

            return new ApiResponse<TaxCategoryDTO> { Success = true, StatusCode = 200, Data = model.FromModelToDto() };
        }

        public async Task<ApiResponse<TaxCategoryDTO>> SoftDelete(string uuid)
        {
            var tax = await _context.TaxCategories.FirstOrDefaultAsync(t => t.UUID == uuid);
            if (tax == null) return new ApiResponse<TaxCategoryDTO> { Success = false, StatusCode = 404, Message = "Not found" };

            tax.IsDeleted = true;
            await _context.SaveChangesAsync();

            return new ApiResponse<TaxCategoryDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = tax.FromModelToDto()
            };
        }

        public async Task<ApiResponse<TaxCategoryDTO>> GetOneAsync(RequestQueryObject queryObject)
        {
            var query = await _context.TaxCategories.FirstOrDefaultAsync(x => x.UUID == queryObject.UUID);
            if (query == null)
            {
                return ApiResponse<TaxCategoryDTO>.Fail(message: "no tax found");
            }

            var dto = query.FromModelToDto();

            return ApiResponse<TaxCategoryDTO>.Ok(dto);


        }
    }
}
