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
    [Route("api/product-batch")]
    [ApiController]
    public class ProductBatchController : BaseController
    {
        private readonly IProductBatchRepository _productBatchRepository;

        public ProductBatchController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<ProductBatchController> logger,
            IProductBatchRepository productBatchRepository
        ) : base(configuration, tokenService, logger)
        {
            _productBatchRepository = productBatchRepository;
        }

        [Authorize(Roles = "admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateBatch([FromBody] NewProductBatchRequest newProductBatchRequest)
        {
            var model = await _productBatchRepository.CreateAsync(newProductBatchRequest);

            if (model == null || !model.Success || model.Success != true)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }
        [Authorize(Roles = "admin")]
        [HttpPatch("edit")]
        public async Task<IActionResult> Edit([FromBody] EditProductBatchRequest newProductBatchRequest)
        {
            var model = await _productBatchRepository.EditAsync(newProductBatchRequest);

            return StatusCode(model.StatusCode, model);
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productBatchRepository.SoftDeleteAsync(queryObject);

            return StatusCode(model.StatusCode, model);

        }

        [Authorize(Roles = "admin")]
        [HttpDelete("activate")]
        public async Task<IActionResult> ActivateProduct([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productBatchRepository.ActivateAsync(queryObject);

            return StatusCode(model.StatusCode, model);

        }

        [HttpGet("get-all-by-warehouse")]
        public async Task<IActionResult> GetAll([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productBatchRepository.GetAllAsycn(queryObject);

            if (model == null || !model.Success || model.Success != true)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }
        [HttpGet("get-by-uuid")]
        public async Task<IActionResult> GetOnByUUID([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productBatchRepository.GetOneByUUID(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("load-pre-new")]
        public async Task<IActionResult> GetAllProducts([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productBatchRepository.GetCreationInfoAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

    }
}