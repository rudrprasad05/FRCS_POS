using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    // [Authorize]
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

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllPosTerminalsByCompany([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _posTerminalRepository.GetAllPosTerminalByCompanyAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-one")]
        public async Task<IActionResult> GetOnePosTerminalById([FromQuery] RequestQueryObject requestQuery)
        {
            var model = await _posTerminalRepository.GetOnePosTerminalByIdAsync(requestQuery);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-sales")]
        public async Task<IActionResult> GetPosTerminalSales([FromQuery] RequestQueryObject requestQuery)
        {
            var model = await _posTerminalRepository.GetPosTerminalSalesAsync(requestQuery);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-sessions")]
        public async Task<IActionResult> GetPosTerminalSessions([FromQuery] RequestQueryObject requestQuery)
        {
            var model = await _posTerminalRepository.GetPosTerminalSessionAsync(requestQuery);

            return StatusCode(model.StatusCode, model);
        }

        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDelete([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _posTerminalRepository.SoftDelete(queryObject);

            if (!model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpPatch("edit")]
        public async Task<IActionResult> SoftDelete([FromQuery] RequestQueryObject queryObject, [FromBody] EditTerminal editTerminal)
        {
            var model = await _posTerminalRepository.EditAsync(editTerminal, queryObject);

            if (!model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpDelete("activate")]
        public async Task<IActionResult> Activate([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _posTerminalRepository.Activate(queryObject);

            if (!model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }
    }
}