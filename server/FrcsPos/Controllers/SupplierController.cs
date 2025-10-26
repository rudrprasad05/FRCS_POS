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
    // Supplier management controller
    [Route("api/supplier")]
    [ApiController]
    [Authorize(Roles = "admin, cashier")]

    public class SupplierController : BaseController
    {
        private readonly ISupplierRepository _supplierRepository;

        // Constructor to inject dependencies
        public SupplierController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<WarehouseController> logger,
            ISupplierRepository supplierRepository
        ) : base(configuration, tokenService, logger)
        {
            _supplierRepository = supplierRepository;
        }

        // Create new supplier
        [Authorize(Roles = "admin")]
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

        // Edit supplier
        [Authorize(Roles = "admin")]
        [HttpPatch("edit")]
        public async Task<IActionResult> EditSupplier([FromBody] EditSupplierData data, [FromQuery] RequestQueryObject queryObject)
        {
            var model = await _supplierRepository.EditAsync(data, queryObject);

            return StatusCode(model.StatusCode, model);
        }

        // Get all supplier
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllSuppliers([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _supplierRepository.GetAllAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        // Get supplier by UUID
        [HttpGet("get-full-by-uuid")]
        public async Task<IActionResult> GetFullWarehouseByUUID([FromQuery] RequestQueryObject requestQueryObject)
        {
            var model = await _supplierRepository.GetOneAsync(requestQueryObject);

            return StatusCode(model.StatusCode, model);
        }

        // Soft delete Supplier
        [Authorize(Roles = "admin")]
        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _supplierRepository.SoftDeleteAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        // Activate supplier
        [Authorize(Roles = "admin")]
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