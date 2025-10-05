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
            [FromForm] string Product,
            [FromForm] List<string> Variants,
            List<IFormFile> VariantFiles,
            [FromQuery] RequestQueryObject queryObject
        )
        {
            var request = new ProductRequest
            {
                Product = Product,
                Variants = Variants,
                VariantFiles = VariantFiles

            };
            var res = await _productRepository.CreateProductAsync(request, queryObject);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateProdut(
            [FromForm] string Product,
            [FromForm] List<string> Variants,
            List<IFormFile> VariantFiles,
            [FromQuery] RequestQueryObject queryObject
        )
        {
            var request = new ProductRequest
            {
                Product = Product,
                Variants = Variants,
                VariantFiles = VariantFiles

            };
            var res = await _productRepository.UpdateProductAsync(request, queryObject);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }

        [HttpPost("get-all-var")]
        public async Task<IActionResult> GetAllProductVariants([FromQuery] RequestQueryObject queryObject, [FromBody] GetProductDTO req)
        {
            var model = await _productRepository.GetAllProductsVariants(queryObject, req.ForPos ?? false);

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

        [HttpGet("get-new-page-info")]
        public async Task<IActionResult> GetNewPageInfo([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _productRepository.GetCreationInfoAsync(queryObject);

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