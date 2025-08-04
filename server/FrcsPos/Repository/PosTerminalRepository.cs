using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class PosTerminalRepository : IPosTerminalRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        
        public PosTerminalRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService
        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;

        }

        public async Task<ApiResponse<PosTerminalDTO>> CreatePosTerminalAsync(NewPosTerminalRequest request)
        {
            var company = request.FromNewPosTerminalToModel();

            var model = await _context.PosTerminals.AddAsync(company);
            await _context.SaveChangesAsync();

            var result = model.Entity.FromModelToDto();

            await _notificationService.CreateNotificationAsync(
                title: "New Pos Terminal",
                message: "The terminal " + result.Name + " was created",
                type: NotificationType.SUCCESS,
                actionUrl: "/admin/cake/" + result.UUID
            );

            return new ApiResponse<PosTerminalDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
            };
        }

        public async Task<ApiResponse<List<CompanyDTO>>> GetAllPosTerminalByCompanyAsync(RequestQueryObject queryObject)
        {
            var query = _context.Companies
                .Include(c => c.PosTerminals)
                .Include(c => c.AdminUser)
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
            var companies = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<CompanyDTO>();
            foreach (var company in companies)
            {
                var dto = company.FromModelToDto();
                result.Add(dto);
            }

            return new ApiResponse<List<CompanyDTO>>
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

        public async Task<ApiResponse<PosTerminalDTO>> GetOnePosTerminalByIdAsync(string uuid)
        {
            var pos = await _context.PosTerminals
                .Where(p => p.UUID == uuid)
                .Include(c => c.Session)
                .Include(c => c.Company)
                .Include(c => c.Sales)
                .OrderByDescending(c => c.CreatedOn)
                .FirstOrDefaultAsync();

            if (pos == null)
            {
                return ApiResponse<PosTerminalDTO>.Fail();
            }

            var dto = pos.FromModelToDto();
            return ApiResponse<PosTerminalDTO>.Ok(dto);
        }
    }
}