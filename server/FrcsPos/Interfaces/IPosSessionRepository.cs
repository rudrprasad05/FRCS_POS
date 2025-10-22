using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IPosSessionRepository
    {
        public Task<ApiResponse<PosSessionDTO>> CreateNewPosSession(NewPosSession request);
        public Task<ApiResponse<PosSessionDTO>> ResumePosSession(ResumePosSession request);
        public Task<ApiResponse<PosSessionDTO>> EndPosSession(ResumePosSession request);
        public Task<ApiResponse<PosSessionWithProducts>> GetPosSessionByUUID(string uuid);
        public Task<ApiResponse<List<PosSessionDTO>>> GetAllSessionsForOneTerminal(string terminalUUID);

    }
}