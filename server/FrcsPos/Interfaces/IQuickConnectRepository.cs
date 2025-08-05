using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IQuickConnectRepository
    {
        public Task<ApiResponse<QuickConnectDTO>> Generate(string sessionId);
        
    }
}