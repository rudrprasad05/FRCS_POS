using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FrcsPos.Mappers;
using FrcsPos.Context;
using FrcsPos.Request;

namespace FrcsPos.Repository
{
    public class SuperAdminDashboardRepository : ISuperAdminDashboardRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly ICompanyRepository _companyRepository;
        private readonly INotificationRepository _notificationRepository;


        public SuperAdminDashboardRepository(INotificationRepository notificationRepository, ICompanyRepository companyRepository, ApplicationDbContext applicationDbContext, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = applicationDbContext;
            _companyRepository = companyRepository;
            _notificationRepository = notificationRepository;


        }

        public async Task<ApiResponse<AdminDashboardDTO>> GetAdminDashboard(RequestQueryObject queryObject)
        {
            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            var company = await _context.Companies
                .Include(c => c.AdminUser)
                .Include(c => c.Users)
                .Include(c => c.Products)
                    .ThenInclude(c => c.Media)
                .Include(c => c.Warehouses)
                .Include(c => c.PosTerminals)
                    .ThenInclude(c => c.Session)
                        .ThenInclude(t => t.Sales
                            .Where(s => s.CreatedOn >= startOfMonth))
                .FirstOrDefaultAsync(c => c.Name == queryObject.CompanyName);

            if (company == null)
            {
                return ApiResponse<AdminDashboardDTO>.NotFound();
            }

            var userCount = company.Users.Count;
            var productCount = company.Products.Count;
            var warehouseCount = company.Warehouses.Count;
            var posTerminalCount = company.PosTerminals.Count;
            var totalSalesAmount = company.PosTerminals
                .SelectMany(t => t.Session
                    .SelectMany(s => s.Sales))
                        .Sum(s => s.Total);
            var mediaCount = company.Products
                .Select(p => p.Media)
                .Sum(m => m?.SizeInBytes);

            var notifications = await _notificationRepository.GetNotificationByCompany(new RequestQueryObject
            {
                CompanyName = queryObject.CompanyName,
                PageSize = 5,
                PageNumber = 1,
                SortBy = ESortBy.DSC,
            });

            var dto = new AdminDashboardDTO
            {
                TotalUsers = userCount,
                TotalProducts = productCount,
                TotalSales = totalSalesAmount,
                Notifications = notifications.Data ?? [],
                TotalMedia = mediaCount ?? 0,
            };

            return new ApiResponse<AdminDashboardDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = dto,
            };
        }

        public async Task<ApiResponse<SuperAdminDashboardDTO>> GetSuperAdminDashboard()
        {
            var userCount = await _context.Users.CountAsync();
            var companyCount = await _context.Companies.CountAsync();
            var mediaCount = await _context.Medias.SumAsync(m => m.SizeInBytes);
            var productCount = await _context.Products.CountAsync();
            var saleCount = await _context.Sales.CountAsync();
            var taxTotal = await _context.Sales.SumAsync(s => s.TaxTotal);

            var notifications = await _notificationRepository.GetSuperAdminNotifications(new RequestQueryObject { PageSize = 5, SortBy = ESortBy.DSC });

            var dto = new SuperAdminDashboardDTO
            {
                TotalUsers = userCount,
                TotalCompanies = companyCount,
                TotalMedia = mediaCount,
                TotalProducts = productCount,
                TotalSales = saleCount,
                Notifications = notifications.Data ?? [],
                TotalVat = (long)taxTotal,
            };

            return new ApiResponse<SuperAdminDashboardDTO>
            {
                Success = true,
                StatusCode = 200,
                Data = dto,
            };
        }
    }
}