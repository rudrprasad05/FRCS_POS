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
        public Task<ApiResponse<PosSessionDTO>> GetPosSession(RequestQueryObject queryObject);
    }
}