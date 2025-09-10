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
        private readonly IUserContext _userContext;

        public PosTerminalRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService,
            IUserContext userContext
        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;
            _userContext = userContext;
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
            var notification = new NotificationDTO
            {
                Title = "New POS Terminal",
                Message = $"The terminal {result.Name} was created",
                Type = NotificationType.SUCCESS,
                ActionUrl = $"/{company.Name}/pos/{result.UUID}",
                IsSuperAdmin = false,
                CompanyId = company.Id,
                UserId = _userContext.UserId
            };

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(notification));

            return new ApiResponse<PosTerminalDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
            };
        }

        public async Task<ApiResponse<List<PosTerminalDTO>>> GetAllPosTerminalByCompanyAsync(RequestQueryObject queryObject)
        {
            // Query terminals directly, but scoped to the company
            var terminalQuery = _context.PosTerminals
                .Where(t => t.Company.Name == queryObject.CompanyName);

            // Company deleted filter (through navigation)
            if (queryObject.IsDeleted.HasValue)
            {
                terminalQuery = terminalQuery.Where(t => t.IsDeleted == queryObject.IsDeleted.Value);
            }

            // Search (example: by terminal name or code — adjust as needed)
            if (!string.IsNullOrWhiteSpace(queryObject.Search))
            {
                terminalQuery = terminalQuery.Where(t => t.Name.Contains(queryObject.Search));
            }

            // Sorting by terminal properties
            terminalQuery = queryObject.SortBy switch
            {
                ESortBy.ASC => terminalQuery.OrderBy(t => t.CreatedOn),
                ESortBy.DSC => terminalQuery.OrderByDescending(t => t.CreatedOn),
                _ => terminalQuery.OrderByDescending(t => t.CreatedOn)
            };

            // Count for pagination
            var totalCount = await terminalQuery.CountAsync();

            // Apply pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var terminals = await terminalQuery
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


        public async Task<ApiResponse<PosTerminalDTO>> GetOnePosTerminalByIdAsync(RequestQueryObject requestQuery)
        {
            var pos = await _context.PosTerminals
            .Where(p => p.UUID == requestQuery.UUID)
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

        public async Task<ApiResponse<List<PosSessionDTO>>> GetPosTerminalSessionAsync(RequestQueryObject queryObject)
        {
            var terminal = await _context.PosTerminals
                .FirstOrDefaultAsync(t => t.UUID == queryObject.UUID);

            if (terminal == null)
            {
                return ApiResponse<List<PosSessionDTO>>.Fail();
            }

            var query = _context.PosSessions
                .Include(x => x.PosUser)
                .AsQueryable();

            // filtering

            query = query.Where(c => c.PosTerminal.UUID == queryObject.UUID);

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
            var products = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<PosSessionDTO>();
            foreach (var product in products)
            {
                var dto = product.FromModelToDTO();
                result.Add(dto);
            }

            return new ApiResponse<List<PosSessionDTO>>
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

        public async Task<ApiResponse<List<SaleDTO>>> GetPosTerminalSalesAsync(RequestQueryObject queryObject)
        {
            var terminal = await _context.PosTerminals
                .FirstOrDefaultAsync(t => t.UUID == queryObject.UUID);

            if (terminal == null)
            {
                return ApiResponse<List<SaleDTO>>.Fail();
            }

            var query = _context.Sales
                .AsQueryable();

            // filtering

            query = query.Where(c => c.PosSession.PosTerminal.UUID == queryObject.UUID);

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
            var products = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<SaleDTO>();
            foreach (var product in products)
            {
                var dto = product.FromModelToDto();
                result.Add(dto);
            }

            return new ApiResponse<List<SaleDTO>>
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

        public async Task<ApiResponse<PosTerminalDTO>> SoftDelete(RequestQueryObject queryObject)
        {
            var wh = await _context.PosTerminals.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (wh == null)
            {
                return ApiResponse<PosTerminalDTO>.NotFound();
            }

            wh.IsDeleted = true;
            wh.IsActive = false;
            wh.UpdatedOn = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            var posTerminalDTO = wh.FromModelToDto();

            return ApiResponse<PosTerminalDTO>.Ok(posTerminalDTO);
        }

        public async Task<ApiResponse<PosTerminalDTO>> EditAsync(EditTerminal editTerminal, RequestQueryObject queryObject)
        {
            var wh = await _context.PosTerminals.FirstOrDefaultAsync(w => w.UUID == queryObject.UUID);
            if (wh == null)
            {
                return ApiResponse<PosTerminalDTO>.Fail(message: "warehouse not found");
            }

            wh.LocationDescription = editTerminal.Location;
            wh.SerialNumber = editTerminal.SerialNumber;
            wh.Name = editTerminal.Name;
            wh.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var whDTO = wh.FromModelToDto();
            return ApiResponse<PosTerminalDTO>.Ok(whDTO);
        }

        public async Task<ApiResponse<PosTerminalDTO>> Activate(RequestQueryObject queryObject)
        {
            var wh = await _context.PosTerminals.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (wh == null)
            {
                return ApiResponse<PosTerminalDTO>.NotFound();
            }

            wh.IsDeleted = false;
            wh.IsActive = true;
            wh.UpdatedOn = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            var dto = wh.FromModelToDto();

            return ApiResponse<PosTerminalDTO>.Ok(dto);
        }
    }
}