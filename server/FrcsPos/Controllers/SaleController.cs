using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/sale")]
    [ApiController]
    public class SaleController : BaseController
    {
        private readonly ICheckoutRepository _checkoutRepository;

        public SaleController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<SaleController> logger,
            ICheckoutRepository checkoutRepository
        ) : base(configuration, tokenService, logger)
        {
            _checkoutRepository = checkoutRepository;
        }

        [HttpGet("get-by-uuid")]
        public async Task<IActionResult> CreateCheckout([FromQuery] string uuid)
        {
            var model = await _checkoutRepository.GetByUUIDAsync(uuid);

            if (model == null || !model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }
        [HttpGet("get-by-company")]
        public async Task<IActionResult> GetSaleByCompany([FromQuery] RequestQueryObject requestQuery)
        {
            var model = await _checkoutRepository.GetSaleByCompanyAsync(requestQuery);

            if (model == null || !model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpGet("get-by-invoice")]
        public async Task<IActionResult> GetReceipt([FromQuery] string uuid)
        {
            var model = await _checkoutRepository.GetReceiptAsync(uuid);

            if (model == null || !model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }


    }
}