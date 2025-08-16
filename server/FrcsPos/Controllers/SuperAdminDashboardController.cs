using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Authorize(Roles = "superadmin")]
    [Route("api/superadmin")]
    [ApiController]
    public class SuperAdminDashboardController : BaseController
    {
        private readonly ISuperAdminDashboardRepository _superAdminDashboardRepository;

        public SuperAdminDashboardController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            ISuperAdminDashboardRepository superAdminDashboardRepository
        ) : base(configuration, tokenService, logger)
        {
            _superAdminDashboardRepository = superAdminDashboardRepository;
        }

        [HttpGet("get-dashboard")]
        public async Task<IActionResult> GetSuperAdminDashboard()
        {
            var model = await _superAdminDashboardRepository.GetSuperAdminDashboard();

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }


    }
}