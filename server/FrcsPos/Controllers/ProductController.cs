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
    [Route("api/product")]
    [ApiController]
    public class ProductController : BaseController
    {
        private readonly IProductRepository _productRepository;

        public ProductController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<ProductController> logger,
            IProductRepository productRepository
        ) : base(configuration, tokenService, logger)
        {
            _productRepository = productRepository;
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

            var model = await _productRepository.CreateProductAsync(data);

            if (model == null || !model.Success || model.Success != true)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllProducts([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productRepository.GetAllProducts(queryObject);

            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("get-full-by-uuid")]
        public async Task<IActionResult> GetFullCompanyByUUID([FromQuery] string uuid)
        {
            var model = await _productRepository.GetProductByUUID(uuid);

            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] string uuid)
        {
            var model = await _productRepository.SoftDelete(uuid);

            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

    }
}