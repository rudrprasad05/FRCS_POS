using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IPosTerminalRepository
    {
        public Task<ApiResponse<PosTerminalDTO>> CreatePosTerminalAsync(NewPosTerminalRequest request);
        public Task<ApiResponse<List<CompanyDTO>>> GetAllPosTerminalByCompanyAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<PosTerminalDTO>> GetOnePosTerminalByIdAsync(string uuid);

    }
}