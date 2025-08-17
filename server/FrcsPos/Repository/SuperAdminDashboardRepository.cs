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
        public async Task<ApiResponse<SuperAdminDashboardDTO>> GetSuperAdminDashboard()
        {
            var userCount = await _context.Users.CountAsync();
            var companyCount = await _context.Companies.CountAsync();
            var mediaCount = await _context.Medias.CountAsync();
            var productCount = await _context.Products.CountAsync();
            var saleCount = await _context.Sales.CountAsync();

            var notifications = await _notificationRepository.GetSuperAdminNotifications(new RequestQueryObject { PageSize = 5 });

            var dto = new SuperAdminDashboardDTO
            {
                TotalUsers = userCount,
                TotalCompanies = companyCount,
                TotalMedia = mediaCount,
                TotalProducts = productCount,
                TotalSales = saleCount,
                Notifications = notifications.Data ?? [],
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