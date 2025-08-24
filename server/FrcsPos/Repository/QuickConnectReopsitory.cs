using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class QuickConnectReopsitory : IQuickConnectRepository
    {
        private readonly INotificationService _notificationService;
        private readonly ApplicationDbContext _context;
        public QuickConnectReopsitory(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService
        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;

        }

        public async Task<ApiResponse<QuickConnectDTO>> Generate(string sessionId)
        {
            var posSession = await _context.PosSessions.FirstOrDefaultAsync(p => p.UUID == sessionId);
            if (posSession == null)
            {
                return ApiResponse<QuickConnectDTO>.Fail();
            }

            var exists = await _context.QuickConnect.FirstOrDefaultAsync(q => q.PosSessionId == posSession.Id);
            if (exists != null)
            {
                _context.QuickConnect.Remove(exists);
            }

            var qc = new QuickConnect
            {
                PosSessionId = posSession.Id,
            };

            await _context.AddAsync(qc);
            await _context.SaveChangesAsync();

            var dto = qc.FromModelToDto();

            return ApiResponse<QuickConnectDTO>.Ok(dto);
        }

        public async Task<ApiResponse<QuickConnectDTO>> ValidateUUID(string uuid)
        {

            var exists = await _context.QuickConnect.FirstOrDefaultAsync(q => q.UUID == uuid);
            if (exists == null)
            {
                return ApiResponse<QuickConnectDTO>.Fail();
            }

            var dto = exists.FromModelToDto();
            return ApiResponse<QuickConnectDTO>.Ok(dto);
        }

        public async Task<ApiResponse<PosSessionDTO>> GetPosSession(string uuid)
        {

            var exists = await _context.QuickConnect
                .Include(c => c.PosSession)
                .FirstOrDefaultAsync(q => q.UUID == uuid);
            if (exists == null)
            {
                return ApiResponse<PosSessionDTO>.Fail();
            }

            var dto = exists.PosSession.FromModelToDTO();
            return ApiResponse<PosSessionDTO>.Ok(dto);
        }
    }
}