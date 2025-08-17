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
using FrcsPos.Services;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class CompanyRepository : ICompanyRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public CompanyRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService
        )
        {
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
                actionUrl: $"/admin/cake/{result.UUID}"
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

            return ApiResponse<CompanyDTO>.Ok(model.FromModelToDto());

        }
    }
}