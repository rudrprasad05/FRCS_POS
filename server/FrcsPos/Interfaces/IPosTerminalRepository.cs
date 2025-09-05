using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IPosTerminalRepository
    {
        public Task<ApiResponse<PosTerminalDTO>> CreatePosTerminalAsync(NewPosTerminalRequest request);
        public Task<ApiResponse<List<PosTerminalDTO>>> GetAllPosTerminalByCompanyAsync(RequestQueryObject queryObject, string companyName);
        public Task<ApiResponse<PosTerminalDTO>> GetOnePosTerminalByIdAsync(string uuid);
        public Task<ApiResponse<List<SaleDTO>>> GetPosTerminalSalesAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<List<PosSessionDTO>>> GetPosTerminalSessionAsync(RequestQueryObject queryObject);



    }
}