using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public async Task<IActionResult> CreatePosSession([FromBody] CreateNewPosSession request)
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

            return StatusCode(model.StatusCode, model);
        }

        [HttpPost("resume")]
        public async Task<IActionResult> ResumeSession([FromBody] CreateNewPosSession request, [FromQuery][Required] string uuid)
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

            var data = new ResumePosSession
            {
                PosTerminalUUID = request.PosTerminalUUID,
                PosUserId = user.Id,
                PosSessionId = uuid,
            };
            var model = await _posSessionRepository.ResumePosSession(data);

            return StatusCode(model.StatusCode, model);
        }

        [HttpPost("end")]
        public async Task<IActionResult> EndSession([FromBody] CreateNewPosSession request, [FromQuery][Required] string uuid)
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

            var data = new ResumePosSession
            {
                PosTerminalUUID = request.PosTerminalUUID,
                PosUserId = user.Id,
                PosSessionId = uuid,
            };
            var model = await _posSessionRepository.EndPosSession(data);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-session-by-uuid")]
        public async Task<IActionResult> GetAllCompanies([FromQuery] string uuid)
        {
            var model = await _posSessionRepository.GetPosSessionByUUID(uuid);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-all-by-terminal-uuid")]
        public async Task<IActionResult> GetAllSessionsForOneTerminal([FromQuery] string terminalUUID)
        {
            var model = await _posSessionRepository.GetPosSessionByUUID(terminalUUID);

            if (model == null || !model.Success)
            {

                return BadRequest(model);
            }

            return Ok(model);
        }
    }
}