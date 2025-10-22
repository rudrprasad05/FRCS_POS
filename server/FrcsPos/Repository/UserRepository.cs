using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;
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
                    Email = u.Email ?? "",
                    Username = u.UserName ?? ""
                })
                .ToListAsync();

            return ApiResponse<List<UserDTO>>.Ok(users);
        }


        public async Task<ApiResponse<List<UserDTO>>> GetAllUsers(RequestQueryObject requestQuery)
        {
            var userDtos = new List<UserDTO>();
            IQueryable<User> query = _userManager.Users;

            if (!string.IsNullOrWhiteSpace(requestQuery.Role) && requestQuery.Role.ToLower() != "user")
            {
                string normalizedRole = requestQuery.Role.Trim().ToUpperInvariant();

                // Get users in the specified role
                var usersInRole = await _userManager.GetUsersInRoleAsync(requestQuery.Role);
                var userIds = usersInRole.Select(u => u.Id).ToList();

                if (userIds.Any())
                {
                    query = query.Where(u => userIds.Contains(u.Id));
                }
                else
                {
                    // No users found in this role
                    query = query.Where(u => false);
                }
            }

            if (!string.IsNullOrWhiteSpace(requestQuery.Search))
            {
                var search = requestQuery.Search.Normalize();
                query = query.Where(
                    c =>
                        (c.NormalizedUserName != null && c.NormalizedUserName.Contains(search)) ||
                        (c.NormalizedEmail != null && c.NormalizedEmail.Contains(search))
                );
            }
            // Sorting
            query = requestQuery.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(u => u.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(u => u.CreatedOn),
                _ => query.OrderByDescending(u => u.CreatedOn)
            };

            if (requestQuery.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == requestQuery.IsDeleted.Value);
            }


            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (requestQuery.PageNumber - 1) * requestQuery.PageSize;
            var users = await query.Skip(skip).Take(requestQuery.PageSize).ToListAsync();

            foreach (var user in users)
            {
                userDtos.Add(await user.FromUserToDtoAsync(_userManager));
            }

            return new ApiResponse<List<UserDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = userDtos,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = requestQuery.PageNumber,
                    PageSize = requestQuery.PageSize
                }
            };
        }

        public async Task<ApiResponse<List<UserDTO>>> GetUserByCompany(RequestQueryObject queryObject)
        {
            if (string.IsNullOrEmpty(queryObject.CompanyName))
            {
                return ApiResponse<List<UserDTO>>.Fail(message: "Invalid query string");
            }

            // Check if company exists
            var company = await _context.Companies
                .Include(c => c.Users)
                    .ThenInclude(cu => cu.User)
                .FirstOrDefaultAsync(c => c.Name == queryObject.CompanyName);

            if (company == null)
            {
                return ApiResponse<List<UserDTO>>.Fail(message: "No company found");
            }

            // Build query: users associated with the company
            var query = _context.Users
                .Where(u => company.Users.Select(cu => cu.UserId).Contains(u.Id))
                .AsQueryable();

            // Filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(u => u.IsDeleted == queryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryObject.Search))
            {
                var search = queryObject.Search.Normalize();
                query = query.Where(
                    c =>
                        (c.NormalizedUserName != null && c.NormalizedUserName.Contains(search)) ||
                        (c.NormalizedEmail != null && c.NormalizedEmail.Contains(search))
                );
            }


            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(u => u.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(u => u.CreatedOn),
                _ => query.OrderByDescending(u => u.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var pagedUsers = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Map to DTOs
            // var result = users.Select(u => u.FromUserToDto()).ToList();

            var result = new List<UserDTO>();

            foreach (var user in pagedUsers)
            {
                var dto = user.FromUserToDto();

                var roles = await _userManager.GetRolesAsync(user);
                dto.Role = roles.FirstOrDefault() ?? "USER";

                result.Add(dto);
            }

            return new ApiResponse<List<UserDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = queryObject.PageNumber,
                    PageSize = queryObject.PageSize
                }
            };
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