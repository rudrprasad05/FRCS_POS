using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/company")]
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
        public async Task<IActionResult> CreateCompany([FromBody] NewPosSession data)
        {
            var model = await _posSessionRepository.CreateNewPosSession(data);

            if (model == null)
            {   
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }
    }
}