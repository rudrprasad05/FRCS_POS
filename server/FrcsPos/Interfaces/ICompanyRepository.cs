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
        public Task<ApiResponse<CompanyDTO>> EditCompanyAsync(NewCompanyRequest request, RequestQueryObject requestQueryObject);
        public Task<ApiResponse<CompanyDTO>> AddUserToCompanyAsync(AddUserToCompany request);
        public Task<ApiResponse<List<CompanyDTO>>> GetAllCompanyAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<bool>> Exists(RequestQueryObject queryObject);
        public Task<ApiResponse<CompanyDTO>> GetCompanyByAdminUserIdAsync(string uuid);
        public Task<ApiResponse<CompanyDTO>> GetCompanyByAssociatedAdminUserIdAsync(string uuid);

        public Task<ApiResponse<CompanyDTO>> GetFullCompanyByUUIDAsync(string uuid);

        public Task<ApiResponse<CompanyDTO>> SoftDelete(string uuid);
        public Task<ApiResponse<CompanyDTO>> Activate(string uuid);
        public Task<ApiResponse<CompanyDTO>> RemoveUserAsync(RemoveUserFromCompany request);

    }
}