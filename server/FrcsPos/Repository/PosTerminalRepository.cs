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
using FrcsPos.Services;
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
            // Get the company
            var company = await _context.Companies
                .Include(c => c.PosTerminals)
                .FirstOrDefaultAsync(c => c.Name == request.CompanyName);

            if (company == null)
            {
                return ApiResponse<PosTerminalDTO>.NotFound();
            }

            var lastTerminal = company.PosTerminals
                .OrderByDescending(t => t.CreatedOn)
                .FirstOrDefault();

            int nextNumber = 1;
            if (lastTerminal != null)
            {
                var parts = lastTerminal.Name.Split('-');
                if (parts.Length > 1 && int.TryParse(parts.Last(), out int lastNumber))
                {
                    nextNumber = lastNumber + 1;
                }
            }

            string newTerminalName = $"{company.Name.Substring(0, Math.Min(2, company.Name.Length)).ToUpper()}-POS-{nextNumber:D3}";

            // Create new terminal
            var newTerminal = new PosTerminal
            {
                Name = newTerminalName,
                CompanyId = company.Id,
            };

            var model = await _context.PosTerminals.AddAsync(newTerminal);
            await _context.SaveChangesAsync();

            var result = model.Entity.FromModelToDto();

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                title: "New POS Terminal",
                message: $"The terminal {result.Name} was created",
                type: NotificationType.SUCCESS,
                actionUrl: "/admin/pos/" + result.UUID
            ));

            return new ApiResponse<PosTerminalDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
            };
        }

        public async Task<ApiResponse<List<PosTerminalDTO>>> GetAllPosTerminalByCompanyAsync(RequestQueryObject queryObject, string companyName)
        {
            bool companyExists = await _context.Companies.AnyAsync(c => c.Name == companyName);
            if (!companyExists)
            {
                return ApiResponse<List<PosTerminalDTO>>.NotFound();
            }

            var query = _context.Companies
            .Include(c => c.PosTerminals)
            .AsQueryable();

            // Filter by company name
            query = query.Where(c => c.Name == companyName);

            // Filtering by IsDeleted if needed
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            // Sorting (based on created date of company or terminals — adjust as needed)
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query
                .SelectMany(c => c.PosTerminals)
                .CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var terminals = await query
                .SelectMany(c => c.PosTerminals) // Flatten to terminals
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Map to DTO
            var result = terminals.Select(t => t.FromModelToDto()).ToList();

            return new ApiResponse<List<PosTerminalDTO>>
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
            .Include(p => p.Company)
            .Include(p => p.Session)
                .ThenInclude(s => s.PosUser)
            .Include(p => p.Session)
                .ThenInclude(s => s.Sales) // sales via session
            .AsSplitQuery()
            .FirstOrDefaultAsync();

            if (pos == null)
            {
                return ApiResponse<PosTerminalDTO>.Fail();
            }

            var allSales = pos.Session.SelectMany(s => s.Sales).ToList();
            List<PosSession> posSessionInOrder = [.. pos.Session.OrderByDescending(s => s.CreatedOn)];

            pos.Sales = allSales;
            pos.Session = posSessionInOrder;

            var dto = pos?.FromModelToDto();
            return ApiResponse<PosTerminalDTO>.Ok(dto);
        }


    }
}