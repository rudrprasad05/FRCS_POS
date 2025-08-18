using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using FrcsPos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/pos-session")]
    [Authorize]
    [ApiController]
    public class PosSessionController : BaseController
    {
        private readonly IPosSessionRepository _posSessionRepository;

        public PosSessionController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            IPosSessionRepository posSessionRepository
        ) : base(configuration, tokenService, logger)
        {
            _posSessionRepository = posSessionRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCompany([FromBody] CreateNewPosSession request)
        {
            var userId = GetCurrentUserId();
            if (userId == null)
            {
                return Unauthorized(ApiResponse<string>.Unauthorised());
            }

            var data = new NewPosSession { PosTerminalUUID = request.PosTerminalUUID, PosUserId = userId };
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