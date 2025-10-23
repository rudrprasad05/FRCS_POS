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
    public interface IUserRepository
    {
        public Task<ApiResponse<UserDTO>> UpdateAsync(string uuid, User User, IFormFile? file);
        public Task<ApiResponse<UserDTO>> CreateAsync(NewUserDTO user);
        public Task<ApiResponse<UserDTO>> GetOne(string uuid);
        public Task<ApiResponse<List<UserDTO>>> GetAllUsers(RequestQueryObject requestQuery);

        public Task<User?> Exists(string uuid);

        public Task<ApiResponse<UserDTO>> ChangePfp(RequestQueryObject requestQuery, IFormFile formFile);
        public Task<ApiResponse<UserDTO>> ChangeUsernameAsync(RequestQueryObject requestQuery, ChangeUsernameRequest request);
        public Task<ApiResponse<UserDTO>> SafeDelete(string uuid);
        public Task<ApiResponse<double>> SumStorage();
        public Task<ApiResponse<List<UserDTO>>> GetAllSuperAdminsNotInCompany(string? role);
        public Task<ApiResponse<List<UserDTO>>> GetUserByCompany(RequestQueryObject queryObject);
    }
}