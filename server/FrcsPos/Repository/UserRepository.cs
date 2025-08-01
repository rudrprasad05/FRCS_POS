using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Identity;

namespace FrcsPos.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        public UserRepository(
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            ITokenService tokenService
        )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;

        }

        public async Task<ApiResponse<UserDTO>> CreateAsync(NewUserDTO request)
        {
            var tempUser = request.FromNewUserDtoToModel();
            var roleType = request.Email.Contains("admin") ? "SUPERADMIN" : "MANAGER";

            try
            {
                var model = new User
                {
                    UserName = tempUser.UserName,
                    Email = tempUser.Email
                };

                // Create user
                var result = await _userManager.CreateAsync(model, tempUser.PasswordHash ?? "");
                if (!await _roleManager.RoleExistsAsync(roleType))
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleType));
                }

                var roleResult = await _userManager.AddToRoleAsync(model, roleType);
                var roles = await _userManager.GetRolesAsync(model);
                var token = _tokenService.CreateToken(model, roles);

                var dto = new UserDTO
                {
                    Username = model.UserName ?? "",
                    Email = model.Email ?? "",
                    Token = token,
                };

                return new ApiResponse<UserDTO>
                {
                    Success = true,
                    StatusCode = 200,
                    Data = dto,
                };

            }
            catch (Exception ex)
            {
                return ApiResponse<UserDTO>.Fail(message: ex.ToString());
            }

        }

        public Task<User?> Exists(string uuid)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<UserDTO>> GetOne(string uuid)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<UserDTO>> SafeDelete(string uuid)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<double>> SumStorage()
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse<UserDTO>> UpdateAsync(string uuid, User User, IFormFile? file)
        {
            throw new NotImplementedException();
        }
    }
}