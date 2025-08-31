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
    [Authorize]
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
        public async Task<IActionResult> CreateProduct(
            [FromForm] string ProductName,
            [FromForm] string SKU,
            [FromForm] decimal Price,
            [FromForm] string Barcode,
            [FromForm] bool IsPerishable,
            IFormFile? File,
            [FromForm] int TaxCategoryId,
            [FromForm] string CompanyName
        )
        {
            var data = new NewProductRequest
            {
                ProductName = ProductName,
                SKU = SKU,
                Price = Price,
                Barcode = Barcode,
                IsPerishable = IsPerishable,
                File = File,
                TaxCategoryId = TaxCategoryId,
                CompanyName = CompanyName,
            };

            var model = await _productBatchRepository.CreateAsync(data);

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
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

    }
}