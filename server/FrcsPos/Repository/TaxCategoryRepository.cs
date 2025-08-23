using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class TaxCategoryRepository : ITaxCategoryRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public TaxCategoryRepository(
           ApplicationDbContext applicationDbContext,
           INotificationService notificationService

       )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;
        }

        public async Task<ApiResponse<List<TaxCategoryDTO>>> GetAllTaxCategories(RequestQueryObject queryObject)
        {
            var query = _context.TaxCategories
                 .AsQueryable();

            // filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var taxCategories = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<TaxCategoryDTO>();
            foreach (var tax in taxCategories)
            {
                var dto = tax.FromModelToDto();
                result.Add(dto);
            }

            return new ApiResponse<List<TaxCategoryDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = queryObject.PageNumber,
                    PageSize = queryObject.PageSize
                }
            };
        }

    }
}