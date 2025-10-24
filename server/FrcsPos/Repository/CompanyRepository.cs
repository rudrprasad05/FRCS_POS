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
        private readonly IUserContext _userContext;
        private readonly IUserMapper _userMapper;
        private readonly IRedisCacheService _redisCacheService;


        public CompanyRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService,
            UserManager<User> userManager,
            IUserContext userContext,
            IUserMapper userMapper,
            IRedisCacheService redisCacheService
        )
        {
            _redisCacheService = redisCacheService;
            _userManager = userManager;
            _context = applicationDbContext;
            _notificationService = notificationService;
            _userContext = userContext;
            _userMapper = userMapper;

        }

        public async Task<ApiResponse<bool>> Exists(RequestQueryObject queryObject)
        {
            string cacheKey = $"company:{queryObject.UUID}";
            var cachedCompany = await _redisCacheService.GetAsync<Company>(cacheKey);
            if (cachedCompany != null)
            {
                return ApiResponse<bool>.Ok(true);
            }

            var model = await _context.Companies.FirstOrDefaultAsync(c => c.UUID == queryObject.CompanyName);
            if (model == null)
            {
                return ApiResponse<bool>.Fail();
            }
            return ApiResponse<bool>.Ok(true);
        }

        public async Task<ApiResponse<CompanyDTO>> CreateCompanyAsync(NewCompanyRequest request)
        {
            var company = request.FromNewCompanyRequestToModel();

            var exists = await _context.Companies.FirstOrDefaultAsync(c => c.Name == request.Name);
            if (exists != null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "duplicate company name");
            }

            var adminAssigned = await _context.Companies.FirstOrDefaultAsync(x => x.AdminUserId == request.AdminUserId);
            if (exists != null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "admin already assigned");
            }

            var model = await _context.Companies.AddAsync(company);
            await _context.SaveChangesAsync();


            var result = model.Entity.FromModelToDto();

            var adminNotification = new NotificationDTO
            {
                Title = "Company created",
                Message = $"The company {result.Name} was created",
                Type = NotificationType.SUCCESS,
                ActionUrl = $"/admin/companies/{result.Id}/view",
                IsSuperAdmin = true,
            };

            var userNotification = new NotificationDTO
            {
                Title = "Company Created",
                Message = $"The company {result.Name} was created",
                Type = NotificationType.SUCCESS,
                ActionUrl = "#",
                IsSuperAdmin = false,
                CompanyId = result.Id,
                UserId = _userContext.UserId
            };

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(adminNotification));
            FireAndForget.Run(_notificationService.CreateBackgroundNotification(userNotification));

            string cacheKey = $"company:{company.UUID}";
            await _redisCacheService.SetAsync(cacheKey, company.FromModelToDto(), TimeSpan.FromMinutes(30));

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

            var adminNotification = new NotificationDTO
            {
                Title = "Company Deleted",
                Message = $"The company {model.Name} was deleted",
                Type = NotificationType.WARNING,
                ActionUrl = "#",
                IsSuperAdmin = true,
            };

            var userNotification = new NotificationDTO
            {
                Title = "Company Deleted",
                Message = $"The company {model.Name} was deleted",
                Type = NotificationType.WARNING,
                ActionUrl = "#",
                IsSuperAdmin = false,
                CompanyId = model.Id,
            };

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(adminNotification));
            FireAndForget.Run(_notificationService.CreateBackgroundNotification(userNotification));

            string cacheKey = $"company:{model.UUID}";
            await _redisCacheService.SetAsync(cacheKey, model.FromModelToDto(), TimeSpan.FromMinutes(30));

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
            string cacheKey = $"company:{uuid}";
            var cachedCompany = await _redisCacheService.GetAsync<Company>(cacheKey);
            if (cachedCompany != null)
            {
                return ApiResponse<CompanyDTO>.Ok(cachedCompany.FromModelToDto());
            }

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


            await _redisCacheService.SetAsync(cacheKey, companyToBeRetuned, TimeSpan.FromMinutes(30));

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
            string cacheKey = $"company:{uuid}";
            var cachedCompany = await _redisCacheService.GetAsync<Company>(cacheKey);
            if (cachedCompany != null)
            {
                return ApiResponse<CompanyDTO>.Ok(cachedCompany.FromModelToDto());
            }

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

            var dto = model.FromModelToDto();

            // Populate user DTOs (CompanyUser → User → UserDTO with role)
            var userDtos = new List<UserDTO>();
            foreach (var companyUser in model.Users)
            {
                var user = companyUser.User;
                if (user != null)
                {
                    userDtos.Add(await _userMapper.FromModelToDtoAsync(user));
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
                dto.AdminUser = await _userMapper.FromModelToDtoAsync(model.AdminUser);
            }

            await _redisCacheService.SetAsync(cacheKey, model.FromModelToDto(), TimeSpan.FromMinutes(30));


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

            var userPartOfCompany = await _context.CompanyUsers.FirstOrDefaultAsync(u => u.UserId == request.UserId && u.Company.UUID == request.CompanyUUID);
            if (userPartOfCompany != null)
            {
                return ApiResponse<CompanyDTO>.Fail(message: "User already part of company");
            }

            var company = await _context.Companies
                .Include(c => c.Users)
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

        public async Task<ApiResponse<CompanyDTO>> EditCompanyAsync(NewCompanyRequest request, RequestQueryObject requestQueryObject)
        {
            string cacheKey = $"company:{requestQueryObject.UUID}";

            var company = await _context.Companies.FirstOrDefaultAsync(x => x.UUID == requestQueryObject.UUID);
            if (company == null)
            {
                return ApiResponse<CompanyDTO>.NotFound(message: "company not found");
            }

            if (company.AdminUserId != request.AdminUserId)
            {
                var newAdmin = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.AdminUserId);
                if (newAdmin == null)
                {
                    return ApiResponse<CompanyDTO>.NotFound(message: "invalid new admin");
                }

                var checkIfAlreadyAdmin = await _context.Companies.FirstOrDefaultAsync(x => x.AdminUserId == newAdmin.Id);
                if (checkIfAlreadyAdmin != null)
                {
                    return ApiResponse<CompanyDTO>.Fail(message: "admin is part of another company");
                }

                company.AdminUserId = request.AdminUserId;

            }

            company.Name = request.Name;

            await _context.SaveChangesAsync();
            await _redisCacheService.SetAsync(cacheKey, company.FromModelToDto(), TimeSpan.FromMinutes(30));

            return ApiResponse<CompanyDTO>.Ok(company.FromModelToDto());
        }

        public async Task<ApiResponse<CompanyDTO>> Activate(string uuid)
        {
            var model = await _context.Companies.FirstOrDefaultAsync(c => c.UUID == uuid);
            if (model == null)
            {
                return ApiResponse<CompanyDTO>.Fail();
            }

            model.IsDeleted = false;
            model.IsActive = true;

            model.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var adminNotification = new NotificationDTO
            {
                Title = "Company Activated",
                Message = $"The company {model.Name} was Activated",
                Type = NotificationType.WARNING,
                ActionUrl = "#",
                IsSuperAdmin = true,
            };

            var userNotification = new NotificationDTO
            {
                Title = "Company Activated",
                Message = $"The company {model.Name} was Activated",
                Type = NotificationType.WARNING,
                ActionUrl = "#",
                IsSuperAdmin = false,
                CompanyId = model.Id,
            };

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(adminNotification));
            FireAndForget.Run(_notificationService.CreateBackgroundNotification(userNotification));

            string cacheKey = $"company:{model.UUID}";
            await _redisCacheService.SetAsync(cacheKey, model.FromModelToDto(), TimeSpan.FromMinutes(30));

            return new ApiResponse<CompanyDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = model.FromModelToDto(),
            };
        }
    }
}