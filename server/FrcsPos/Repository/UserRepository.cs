using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly ApplicationDbContext _context;

        public UserRepository(
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            ITokenService tokenService,
            ApplicationDbContext context
        )
        {
            _userManager = userManager;
            _context = context;
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

        public async Task<ApiResponse<List<UserDTO>>> GetAllUsers(string? role)
        {
            var userDtos = new List<UserDTO>();

            if (!string.IsNullOrWhiteSpace(role))
            {
                string normalizedRole = role.Trim().ToUpperInvariant();

                var usersInRole = await _userManager.GetUsersInRoleAsync(normalizedRole);
                foreach (var user in usersInRole)
                {
                    userDtos.Add(user.FromUserToDto());
                }
            }
            else
            {
                // Get all users
                var allUsers = await _userManager.Users.ToListAsync();
                foreach (var user in allUsers)
                {
                    userDtos.Add(user.FromUserToDto());
                }
            }

            return ApiResponse<List<UserDTO>>.Ok(userDtos);
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