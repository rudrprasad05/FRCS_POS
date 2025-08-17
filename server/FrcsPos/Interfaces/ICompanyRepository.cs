using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface ICompanyRepository
    {
        public Task<ApiResponse<CompanyDTO>> CreateCompanyAsync(NewCompanyRequest request);
        public Task<ApiResponse<List<CompanyDTO>>> GetAllCompanyAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<CompanyDTO>> GetCompanyByAdminUserIdAsync(string uuid);
        public Task<ApiResponse<CompanyDTO>> GetFullCompanyByUUIDAsync(string uuid);

        public Task<ApiResponse<CompanyDTO>> SoftDelete(string uuid);

    }
}