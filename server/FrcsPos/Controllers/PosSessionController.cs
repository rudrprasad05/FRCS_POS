using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/pos-session")]
    [Authorize]
    [ApiController]
    public class PosSessionController : BaseController
    {
        private readonly IPosSessionRepository _posSessionRepository;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public PosSessionController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            IPosSessionRepository posSessionRepository
        ) : base(configuration, tokenService, logger)
        {
            _posSessionRepository = posSessionRepository;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCompany([FromBody] CreateNewPosSession request)
        {
            // Try to find user by email
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return Unauthorized(ApiResponse<string>.Fail(message: "Invalid credentials"));
            }

            // Check password
            var validPassword = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!validPassword.Succeeded)
            {
                return Unauthorized(ApiResponse<string>.Fail(message: "Invalid credentials"));
            }

            var data = new NewPosSession
            {
                PosTerminalUUID = request.PosTerminalUUID,
                PosUserId = user.Id
            };
            var model = await _posSessionRepository.CreateNewPosSession(data);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("get-session-by-uuid")]
        public async Task<IActionResult> GetAllCompanies([FromQuery] string uuid)
        {
            var model = await _posSessionRepository.GetPosSessionByUUID(uuid);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }
    }
}