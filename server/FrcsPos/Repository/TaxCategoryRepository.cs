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
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryObject.Search))
            {
                var search = queryObject.Search.ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(search)
                );
            }
            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };


            var totalCount = await query.CountAsync();
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

            var taxCategories = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();
            var result = taxCategories.Select(t => t.FromModelToDto()).ToList();

            return ApiResponse<List<TaxCategoryDTO>>.Ok(result);
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
            return ApiResponse<TaxCategoryDTO>.Ok(model.FromModelToDto());
        }

        public async Task<ApiResponse<TaxCategoryDTO>> EditTaxAsync(NewTaxRequest request, RequestQueryObject queryObject)
        {

            if (request == null)
                return ApiResponse<TaxCategoryDTO>.Fail(message: "Invalid request data");

            if (request.Percentage < 0 || request.Percentage > 100)
                return ApiResponse<TaxCategoryDTO>.Fail(message: "Tax rate to be between 0 and 100");


            var tax = await _context.TaxCategories.FirstOrDefaultAsync(t => t.UUID == queryObject.UUID);
            if (tax == null)
            {
                return ApiResponse<TaxCategoryDTO>.NotFound();
            }

            tax.Name = request.Name;
            tax.RatePercent = request.Percentage;
            tax.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<TaxCategoryDTO>.Ok(tax.FromModelToDto());
        }


        public async Task<ApiResponse<TaxCategoryDTO>> SoftDelete(string uuid)
        {
            var tax = await _context.TaxCategories.FirstOrDefaultAsync(t => t.UUID == uuid);
            if (tax == null) return ApiResponse<TaxCategoryDTO>.NotFound();

            tax.IsDeleted = true;
            tax.IsActive = false;
            await _context.SaveChangesAsync();

            return new ApiResponse<TaxCategoryDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = tax.FromModelToDto()
            };
        }

        public async Task<ApiResponse<TaxCategoryDTO>> ActivateAsync(string uuid)
        {
            var tax = await _context.TaxCategories.FirstOrDefaultAsync(t => t.UUID == uuid);
            if (tax == null) return ApiResponse<TaxCategoryDTO>.NotFound();

            tax.IsDeleted = false;
            tax.IsActive = true;
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
                return ApiResponse<TaxCategoryDTO>.NotFound();
            }

            var dto = query.FromModelToDto();

            return ApiResponse<TaxCategoryDTO>.Ok(dto);


        }
    }
}
