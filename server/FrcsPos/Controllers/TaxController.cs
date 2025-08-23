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
    [Route("api/tax")]
    [ApiController]
    public class TaxController : BaseController
    {
        private readonly ITaxCategoryRepository taxCategoryRepository;

        public TaxController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<TaxController> logger,
            ITaxCategoryRepository _taxCategoryRepository
        ) : base(configuration, tokenService, logger)
        {
            taxCategoryRepository = _taxCategoryRepository;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllTax([FromQuery] RequestQueryObject queryObject)
        {
            var model = await taxCategoryRepository.GetAllTaxCategories(queryObject);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }


    }
}