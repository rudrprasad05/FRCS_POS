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
using System.Security.Claims;

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
            var posTerminal = await _context.PosTerminals.SingleOrDefaultAsync(p => p.UUID == request.PosTerminalUUID);
            if (posTerminal == null)
            {
                return ApiResponse<PosSessionDTO>.Fail();
            }

            // var isAnySessionsActive = await _context.PosSessions
            //     .Where(a => a.PosTerminal.UUID == request.PosTerminalUUID && a.IsActive == true)
            //     .ToListAsync();

            // if (isAnySessionsActive != null && isAnySessionsActive.Count > 0)
            // {
            //     foreach (var s in isAnySessionsActive)
            //     {
            //         s.IsActive = false;   
            //     }
            // }

            var session = new PosSession
            {
                ConnectionUUID = Guid.NewGuid().ToString(),
                ConnectionTimeOut = DateTime.UtcNow.AddHours(8),
                IsActive = true,
                PosTerminalId = posTerminal.Id,
                PosUserId = request.PosUserId,
            };

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

        public async Task<ApiResponse<PosSessionDTO>> GetPosSessionByUUID(string uuid)
        {
            var posSession = await _context.PosSessions
                .Include(s => s.PosTerminal)
                    .ThenInclude(t => t.Company)
                        .ThenInclude(c => c.Products)
                            .ThenInclude(p => p.Media)
                .FirstOrDefaultAsync(s => s.UUID == uuid);

            if (posSession == null)
            {
                return ApiResponse<PosSessionDTO>.Fail();
            }

            var result = posSession.FromModelToDTO();
            result.Products = posSession.PosTerminal.Company.Products.FromModelToDto();

            return new ApiResponse<PosSessionDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = result,

            };
        }
    }
}