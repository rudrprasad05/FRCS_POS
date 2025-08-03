using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/pos-terminal")]
    [ApiController]
    public class PosTerminalController : BaseController
    {
        private readonly IPosTerminalRepository _posTerminalRepository;

        public PosTerminalController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            IPosTerminalRepository posTerminalRepository
        ) : base(configuration, tokenService, logger)
        {
            _posTerminalRepository = posTerminalRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCompany([FromBody] NewPosTerminalRequest data)
        {
            var model = await _posTerminalRepository.CreatePosTerminalAsync(data);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("get-all-by-company")]
        public async Task<IActionResult> GetAllPosTerminalsByCompany([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _posTerminalRepository.GetAllPosTerminalByCompanyAsync(queryObject);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("get-one")]
        public async Task<IActionResult> GetOnePosTerminalById([FromQuery]string uuid)
        {
            var model = await _posTerminalRepository.GetOnePosTerminalByIdAsync(uuid);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }
    }
}