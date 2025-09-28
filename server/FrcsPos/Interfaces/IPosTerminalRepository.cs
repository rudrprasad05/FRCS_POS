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
        public Task<ApiResponse<List<PosTerminalDTO>>> GetAllPosTerminalByCompanyAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<PosTerminalDTO>> GetOnePosTerminalByIdAsync(RequestQueryObject requestQuery);
        public Task<ApiResponse<List<SaleDTO>>> GetPosTerminalSalesAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<List<PosSessionDTO>>> GetPosTerminalSessionAsync(RequestQueryObject queryObject);

        public Task<ApiResponse<PosTerminalDTO>> SoftDelete(RequestQueryObject queryObject);
        public Task<ApiResponse<PosTerminalDTO>> EditAsync(EditTerminal editTerminal, RequestQueryObject queryObject);

        public Task<ApiResponse<PosTerminalDTO>> Activate(RequestQueryObject queryObject);


    }
}