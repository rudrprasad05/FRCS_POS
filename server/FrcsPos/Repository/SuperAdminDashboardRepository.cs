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

namespace FrcsPos.Repository
{
    public class SuperAdminDashboardRepository : ISuperAdminDashboardRepository
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;


        public SuperAdminDashboardRepository(ApplicationDbContext applicationDbContext, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = applicationDbContext;
            

        }
        public async Task<ApiResponse<SuperAdminDashboardDTO>> GetSuperAdminDashboard()
        {
            var users = await _context.Users.ToListAsync();
            var companies = await _context.Companies.Include(c => c.AdminUser).ToListAsync();

            var companyDtos = new List<CompanyDTO>();
            var userDtos = new List<UserDTO>();

            foreach (var user in users)
            {
                userDtos.Add(user.FromUserToDto());
            };

            foreach (var company in companies)
            {
                companyDtos.Add(company.FromModelToDto());
            };

            var dto = new SuperAdminDashboardDTO
            {
                Users = userDtos,
                Companies = companyDtos
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