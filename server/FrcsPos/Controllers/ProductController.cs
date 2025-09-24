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
            [FromForm] string CompanyName,
            [FromForm] int FirstWarningInDays,
            [FromForm] int CriticalWarningInHours
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
                FirstWarningInDays = FirstWarningInDays,
                CriticalWarningInHours = CriticalWarningInHours
            };

            var model = await _productRepository.CreateProductAsync(data);

            if (model == null || !model.Success || model.Success != true)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpPost("get-all")]
        public async Task<IActionResult> GetAllProducts([FromQuery] RequestQueryObject queryObject, [FromBody] GetProductDTO req)
        {
            var model = await _productRepository.GetAllProducts(queryObject, req.ForPos ?? false);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }


        [HttpGet("get-edit-page-info")]
        public async Task<IActionResult> GetProductEditPage([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productRepository.GetProductEditPageAsync(queryObject);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpPatch("edit")]
        public async Task<IActionResult> EditProduct(
            [FromQuery] RequestQueryObject queryObject,
            [FromForm] string ProductName,
            [FromForm] string SKU,
            [FromForm] decimal Price,
            [FromForm] string Barcode,
            [FromForm] bool IsPerishable,
            IFormFile? File,
            [FromForm] int TaxCategoryId,
            [FromForm] int MediaId

        )
        {
            var data = new EditProductRequest
            {
                ProductName = ProductName,
                SKU = SKU,
                Price = Price,
                Barcode = Barcode,
                IsPerishable = IsPerishable,
                File = File,
                MediaId = MediaId,
                TaxCategoryId = TaxCategoryId,
            };
            var model = await _productRepository.EditProductAsync(queryObject, data);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpGet("get-full-by-uuid")]
        public async Task<IActionResult> GetFullCompanyByUUID([FromQuery] string uuid)
        {
            var model = await _productRepository.GetProductByUUID(uuid);

            if (model == null || !model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productRepository.SoftDelete(queryObject);

            if (!model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpDelete("activate")]
        public async Task<IActionResult> ActivateProduct([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productRepository.Activate(queryObject);

            if (!model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

    }
}