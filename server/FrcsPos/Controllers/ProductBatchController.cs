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
    // [Authorize]
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

        [HttpGet("load-pre-new")]
        public async Task<IActionResult> GetAllProducts([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productBatchRepository.GetCreationInfoAsync(queryObject);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

    }
}