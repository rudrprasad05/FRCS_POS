using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Authorize(Roles = "admin, cashier")]
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
        [Authorize(Roles = "admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateCheckout([FromBody] NewWarehouseRequest data)
        {
            var model = await _warehouseRepository.CreateAsync(data);

            if (!model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [Authorize(Roles = "admin")]
        [HttpPatch("edit")]
        public async Task<IActionResult> EditWarehouse([FromBody] EditWarehouseData data, [FromQuery] RequestQueryObject queryObject)
        {
            var model = await _warehouseRepository.EditAsync(data, queryObject);

            if (!model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllWarehouses([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _warehouseRepository.GetAllAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-full-by-uuid")]
        public async Task<IActionResult> GetFullWarehouseByUUID([FromQuery] RequestQueryObject requestQueryObject)
        {
            var model = await _warehouseRepository.GetOneAsync(requestQueryObject);

            return StatusCode(model.StatusCode, model);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _warehouseRepository.SoftDeleteAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }
        [Authorize(Roles = "admin")]
        [HttpDelete("activate")]
        public async Task<IActionResult> ActivateProduct([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _warehouseRepository.Activate(queryObject);

            if (!model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }



    }
}