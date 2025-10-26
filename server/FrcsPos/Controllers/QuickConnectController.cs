using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    // Quick Connect functionality Controller
    [Route("api/quickconnect")]
    [ApiController]
    public class QuickConnectController : BaseController
    {
        private readonly IQuickConnectRepository _quickConnectRepository;

        public QuickConnectController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            IQuickConnectRepository quickConnectRepository
        ) : base(configuration, tokenService, logger)
        {
            _quickConnectRepository = quickConnectRepository;
        }

        // Generate quick connect link
        [HttpGet("generate")]
        public async Task<IActionResult> CreateCompany([FromQuery] string uuid)
        {
            var model = await _quickConnectRepository.Generate(uuid);

            return StatusCode(model.StatusCode, model);
        }

        // Validate quick connect UUID
        [HttpGet("validate")]
        public async Task<IActionResult> ValidateQCLink([FromQuery] string uuid)
        {
            var model = await _quickConnectRepository.ValidateUUID(uuid);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            if (model.Success != true)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }
    }
}