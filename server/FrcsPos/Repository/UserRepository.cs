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

        public async Task<ApiResponse<List<UserDTO>>> GetAllSuperAdminsNotInCompany(string? role = null)
        {
            var superAdminRoleId = await _context.Roles
                .Where(r => r.NormalizedName == "SUPERADMIN")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();

            var query = _context.Users.AsQueryable();

            query = query.Where(
                u => !_context.UserRoles.Any(ur => ur.UserId == u.Id && ur.RoleId == superAdminRoleId));

            query = query.Where(u =>
                !_context.CompanyUsers.Any(cu => cu.UserId == u.Id) &&
                !_context.Companies.Any(c => c.AdminUserId == u.Id));

            if (!string.IsNullOrEmpty(role))
            {
                var roleId = await _context.Roles
                    .Where(r => r.NormalizedName == role.ToUpper())
                    .Select(r => r.Id)
                    .FirstOrDefaultAsync();

                query = query.Where(u => _context.UserRoles
                    .Any(ur => ur.UserId == u.Id && ur.RoleId == roleId));
            }

            var users = await query
                .Select(u => new UserDTO
                {
                    Id = u.Id,
                    Email = u.Email,
                    Username = u.UserName
                })
                .ToListAsync();

            return ApiResponse<List<UserDTO>>.Ok(users);
        }


        public async Task<ApiResponse<List<UserDTO>>> GetAllUsers(string? role)
        {
            var userDtos = new List<UserDTO>();

            if (!string.IsNullOrWhiteSpace(role))
            {
                string normalizedRole = role.Trim().ToUpperInvariant();

                var usersInRole = await _userManager.GetUsersInRoleAsync(normalizedRole);
                foreach (var user in usersInRole.OrderByDescending(u => u.CreatedOn))
                {
                    userDtos.Add(await user.FromUserToDtoAsync(_userManager));
                }
            }
            else
            {
                // Get all users, sorted by CreatedOn descending
                var allUsers = await _userManager.Users
                    .OrderByDescending(u => u.CreatedOn)
                    .ToListAsync();

                foreach (var user in allUsers)
                {
                    userDtos.Add(await user.FromUserToDtoAsync(_userManager));
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