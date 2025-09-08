using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly UserManager<User> _userManager;

        public CompanyRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService,
            UserManager<User> userManager
        )
        {
            _userManager = userManager;
            _context = applicationDbContext;
            _notificationService = notificationService;


        }

        public async Task<ApiResponse<CompanyDTO>> CreateCompanyAsync(NewCompanyRequest request)
        {
            var company = request.FromNewCompanyRequestToModel();

            var exists = await _context.Companies.FirstOrDefaultAsync(c => c.Name == request.Name);
            if (exists != null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "duplicate company name");
            }

            var model = await _context.Companies.AddAsync(company);
            await _context.SaveChangesAsync();

            var result = model.Entity.FromModelToDto();

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                title: "New Company",
                message: $"The company '{result.Name}' was created",
                type: NotificationType.SUCCESS,
                actionUrl: $"/admin/companies/{result.UUID}",
                isSuperAdmin: true,
                companyId: result.Id
            ));

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                title: "New company",
                message: $"You've been assigned the company " + result.Name,
                type: NotificationType.SUCCESS,
                actionUrl: "/",
                isSuperAdmin: false,
                companyId: result.Id,
                userId: request.AdminUserId
            ));


            return new ApiResponse<CompanyDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
            };
        }

        public async Task<ApiResponse<CompanyDTO>> SoftDelete(string uuid)
        {

            var model = await _context.Companies.FirstOrDefaultAsync(c => c.UUID == uuid);
            if (model == null)
            {
                return ApiResponse<CompanyDTO>.Fail();
            }

            model.IsDeleted = true;
            model.UpdatedOn = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                title: "Company Deleted",
                message: "The company '" + model.Name + "' was deleted",
                type: NotificationType.WARNING,
                actionUrl: "/admin/cake/" + model.UUID
            ));

            return new ApiResponse<CompanyDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = model.FromModelToDto(),
            };
        }

        public async Task<ApiResponse<List<CompanyDTO>>> GetAllCompanyAsync(RequestQueryObject queryObject)
        {
            var query = _context.Companies
                .Include(c => c.AdminUser)
                .AsQueryable();

            // filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrWhiteSpace(queryObject.Search))
            {
                var search = queryObject.Search.ToLower();
                query = query.Where(c => c.Name.ToLower().Contains(search));
            }

            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var companies = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<CompanyDTO>();
            foreach (var company in companies)
            {
                var dto = company.FromModelToDto();
                result.Add(dto);
            }

            return new ApiResponse<List<CompanyDTO>>
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

        public async Task<ApiResponse<CompanyDTO>> GetCompanyByAdminUserIdAsync(string uuid)
        {
            var model = await _context.Companies.FirstOrDefaultAsync(c => c.AdminUserId == uuid);
            CompanyDTO? companyToBeRetuned = null;

            if (model != null)
            {
                companyToBeRetuned = model.FromModelToDTOWithoutPosTerminals();
            }
            else if (model == null)
            {
                var company = await _context.CompanyUsers
                .Where(cu => cu.UserId == uuid)
                .Select(cu => cu.Company)
                .FirstOrDefaultAsync();

                if (company != null)
                {
                    companyToBeRetuned = company.FromModelToDTOWithoutPosTerminals();
                }
            }

            if (companyToBeRetuned == null)
            {
                return ApiResponse<CompanyDTO>.Fail();
            }
            return ApiResponse<CompanyDTO>.Ok(companyToBeRetuned);
        }
        public async Task<ApiResponse<CompanyDTO>> GetCompanyByAssociatedAdminUserIdAsync(string uuid)
        {
            var model = await _context.CompanyUsers.Include(cu => cu.Company).FirstOrDefaultAsync(cu => cu.UserId == uuid);
            CompanyDTO? companyToBeRetuned = null;

            if (model != null)
            {
                companyToBeRetuned = model.Company.FromModelToDTOWithoutPosTerminals();
            }
            else if (model == null)
            {
                var company = await _context.CompanyUsers
                .Where(cu => cu.UserId == uuid)
                .Select(cu => cu.Company)
                .FirstOrDefaultAsync();

                if (company != null)
                {
                    companyToBeRetuned = company.FromModelToDTOWithoutPosTerminals();
                }
            }

            if (companyToBeRetuned == null)
            {
                return ApiResponse<CompanyDTO>.Fail();
            }
            return ApiResponse<CompanyDTO>.Ok(companyToBeRetuned);
        }

        public async Task<ApiResponse<CompanyDTO>> GetFullCompanyByUUIDAsync(string uuid)
        {
            var model = await _context.Companies
            .Include(c => c.Warehouses)
            .Include(c => c.Products)
            .Include(c => c.AdminUser)
            .Include(c => c.Users)
                .ThenInclude(cu => cu.User)
            .Include(c => c.PosTerminals)
            .FirstOrDefaultAsync(c => c.UUID == uuid);

            if (model == null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "Company not found");
            }

            // Map company → DTO
            var dto = model.FromModelToDto();

            // Populate user DTOs (CompanyUser → User → UserDTO with role)
            var userDtos = new List<UserDTO>();
            foreach (var companyUser in model.Users)
            {
                var user = companyUser.User;
                if (user != null)
                {
                    userDtos.Add(await user.FromUserToDtoAsync(_userManager));
                }
            }

            var companyUserDtos = new List<CompanyUserDTO>();
            foreach (var user in userDtos)
            {
                if (user != null)
                {
                    companyUserDtos.Add(new CompanyUserDTO
                    {
                        CompanyId = dto.Id,
                        UserId = user.Id,
                        User = user
                    });
                }
            }

            dto.Users = companyUserDtos;

            // Populate AdminUser (with role as well)
            if (model.AdminUser != null)
            {
                dto.AdminUser = await model.AdminUser.FromUserToDtoAsync(_userManager);
            }


            return ApiResponse<CompanyDTO>.Ok(dto);
        }

        public async Task<ApiResponse<CompanyDTO>> RemoveUserAsync(RemoveUserFromCompany request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(x => x.UUID == request.CompanyId);
            if (company == null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "company not found");
            }

            var companyUser = await _context.CompanyUsers.FirstOrDefaultAsync(x => x.CompanyId == company.Id && x.UserId == request.UserId);
            if (companyUser == null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "company user not found");
            }

            _context.CompanyUsers.Remove(companyUser);
            await _context.SaveChangesAsync();

            var dto = company.FromModelToDto();

            return ApiResponse<CompanyDTO>.Ok(dto);
        }

        public async Task<ApiResponse<CompanyDTO>> AddUserToCompanyAsync(AddUserToCompany request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);
            if (user == null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "User not found");
            }

            var company = await _context.Companies
                .Include(c => c.Users) // make sure Users are loaded
                .FirstOrDefaultAsync(c => c.UUID == request.CompanyUUID || c.Name == request.CompanyUUID);
            if (company == null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "Company not found");
            }

            var userClaims = await _userManager.GetClaimsAsync(user);
            var roleClaim = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.Role);

            var companyUser = new CompanyUser
            {
                CompanyId = company.Id,
                UserId = user.Id,
                Role = roleClaim?.Value == "ADMIN"
                    ? CompanyRole.MANAGER
                    : CompanyRole.CASHIER
            };

            company.Users.Add(companyUser);
            await _context.SaveChangesAsync();

            return ApiResponse<CompanyDTO>.Ok(company.FromModelToDto());

        }
    }
}