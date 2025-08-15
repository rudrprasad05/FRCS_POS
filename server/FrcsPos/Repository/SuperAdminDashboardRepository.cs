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
            var users = await _context.Users.ToListAsync();
            var userDtos = new List<UserDTO>();
            foreach (var user in users)
            {
                userDtos.Add(user.FromUserToDto());
            }
            ;
            var pos = await _companyRepository.GetAllCompanyAsync(new RequestQueryObject());

            var notifications = await _notificationRepository.GetSuperAdminNotifications(new RequestQueryObject { PageSize = 8 });

            var dto = new SuperAdminDashboardDTO
            {
                Users = userDtos,
                Companies = pos.Data ?? [],
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