using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;


namespace FrcsPos.Interfaces
{
    public interface IUserRepository
    {
        public Task<ApiResponse<UserDTO>> UpdateAsync(string uuid, User User, IFormFile? file);
        public Task<ApiResponse<UserDTO>> CreateAsync(NewUserDTO user);
        public Task<ApiResponse<UserDTO>> GetOne(string uuid);
        public Task<ApiResponse<List<UserDTO>>> GetAllUsers(string? role);

        public Task<User?> Exists(string uuid);
        public Task<ApiResponse<UserDTO>> SafeDelete(string uuid);
        public Task<ApiResponse<double>> SumStorage();
    }
}