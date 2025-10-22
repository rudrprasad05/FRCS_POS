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

        [Authorize(Roles = "superadmin")]
        [HttpGet("get-dashboard")]
        public async Task<IActionResult> GetSuperAdminDashboard()
        {
            var model = await _superAdminDashboardRepository.GetSuperAdminDashboard();

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("company-dashboard")]
        public async Task<IActionResult> GetAdminDashboard([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _superAdminDashboardRepository.GetAdminDashboard(queryObject);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }


    }
}