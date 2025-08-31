using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/warehouse")]
    [ApiController]
    public class WarehouseController : BaseController
    {
        private readonly IWarehouseRepository _warehouseRepository;

        public WarehouseController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<WarehouseController> logger,
            IWarehouseRepository warehouseRepository
        ) : base(configuration, tokenService, logger)
        {
            _warehouseRepository = warehouseRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCheckout([FromBody] NewWarehouseRequest data)
        {
            var model = await _warehouseRepository.CreateAsync(data);

            if (model == null || !model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllProducts([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _warehouseRepository.GetAllAsync(queryObject);

            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("get-full-by-uuid")]
        public async Task<IActionResult> GetFullWarehouseByUUID([FromQuery] RequestQueryObject requestQueryObject)
        {
            var model = await _warehouseRepository.GetOneAsync(requestQueryObject);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] string uuid)
        {
            var model = await _warehouseRepository.SoftDeleteAsync(uuid);

            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }



    }
}