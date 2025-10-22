using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/supplier")]
    [ApiController]
    public class SupplierController : BaseController
    {
        private readonly ISupplierRepository _supplierRepository;

        public SupplierController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<WarehouseController> logger,
            ISupplierRepository supplierRepository
        ) : base(configuration, tokenService, logger)
        {
            _supplierRepository = supplierRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateSupplier([FromBody] NewSupplierRequest data)
        {
            var model = await _supplierRepository.CreateAsync(data);

            if (!model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpPatch("edit")]
        public async Task<IActionResult> EditSupplier([FromBody] EditSupplierData data, [FromQuery] RequestQueryObject queryObject)
        {
            var model = await _supplierRepository.EditAsync(data, queryObject);

            if (!model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllSuppliers([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _supplierRepository.GetAllAsync(queryObject);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpGet("get-full-by-uuid")]
        public async Task<IActionResult> GetFullWarehouseByUUID([FromQuery] RequestQueryObject requestQueryObject)
        {
            var model = await _supplierRepository.GetOneAsync(requestQueryObject);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _supplierRepository.SoftDeleteAsync(queryObject);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpPost("activate")]
        public async Task<IActionResult> ActivateProduct([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _supplierRepository.Activate(queryObject);

            if (!model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }



    }
}