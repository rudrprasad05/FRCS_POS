using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface ISuperAdminDashboardRepository
    {
        public Task<ApiResponse<SuperAdminDashboardDTO>> GetSuperAdminDashboard();
        public Task<ApiResponse<AdminDashboardDTO>> GetAdminDashboard(RequestQueryObject queryObject);
    }
}