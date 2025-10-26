using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    // Superadmin dashboard Controller
    [Route("api/superadmin")]
    [ApiController]
    public class SuperAdminDashboardController : BaseController
    {
        private readonly ISuperAdminDashboardRepository _superAdminDashboardRepository;

        // Constructor to inject dependencies
        public SuperAdminDashboardController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            ISuperAdminDashboardRepository superAdminDashboardRepository
        ) : base(configuration, tokenService, logger)
        {
            _superAdminDashboardRepository = superAdminDashboardRepository;
        }

        // Get Superadmin dashboard data
        [Authorize(Roles = "superadmin")]
        [HttpGet("get-dashboard")]
        public async Task<IActionResult> GetSuperAdminDashboard()
        {
            var model = await _superAdminDashboardRepository.GetSuperAdminDashboard();

            return StatusCode(model.StatusCode, model);
        }

        // Get admin dashboard data
        [Authorize(Roles = "admin")]
        [HttpGet("company-dashboard")]
        public async Task<IActionResult> GetAdminDashboard([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _superAdminDashboardRepository.GetAdminDashboard(queryObject);

            return StatusCode(model.StatusCode, model);
        }


    }
}