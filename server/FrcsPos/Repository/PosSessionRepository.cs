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
    public class PosSessionRepository : IPosSessionRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        
        public PosSessionRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService
        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;

        }
        public async Task<ApiResponse<PosSessionDTO>> CreateNewPosSession(NewPosSession request)
        {
            var isAnySessionsActive = await _context.PosSessions
                .Where(a => a.PosTerminalId == request.PosTerminalId && a.IsActive == true)
                .ToListAsync();

            if (isAnySessionsActive != null && isAnySessionsActive.Count > 0)
            {
                foreach (var s in isAnySessionsActive)
                {
                    s.IsActive = false;   
                }
            }
            var session = request.FromNewPosSessionRequestToModel();

            session.ConnectionUUID = Guid.NewGuid().ToString();
            session.IsActive = true;

            var model = await _context.PosSessions.AddAsync(session);
            await _context.SaveChangesAsync();

            var result = model.Entity.FromModelToDTO();

            return new ApiResponse<PosSessionDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
            };
        }

        public async Task<ApiResponse<List<CompanyDTO>>> GetAllCompanyAsync(RequestQueryObject queryObject)
        {
            var query = _context.Companies
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

        public Task<ApiResponse<PosSessionDTO>> GetPosSession(RequestQueryObject queryObject)
        {
            throw new NotImplementedException();
        }
    }
}