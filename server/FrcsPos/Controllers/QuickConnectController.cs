using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
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

        [HttpGet("generate")]
        public async Task<IActionResult> CreateCompany([FromQuery] string uuid)
        {
            var model = await _quickConnectRepository.Generate(uuid);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("validate")]
        public async Task<IActionResult> ValidateQCLink([FromQuery] string uuid)
        {
            var model = await _quickConnectRepository.ValidateUUID(uuid);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            if (model.Success != true)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }
    }
}