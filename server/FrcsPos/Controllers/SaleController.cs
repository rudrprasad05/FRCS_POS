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
    // Sale Controller
    [Route("api/sale")]
    [ApiController]
    public class SaleController : BaseController
    {
        private readonly ICheckoutRepository _checkoutRepository;
        
        // Constructor to inject dependencies
        public SaleController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<SaleController> logger,
            ICheckoutRepository checkoutRepository
        ) : base(configuration, tokenService, logger)
        {
            _checkoutRepository = checkoutRepository;
        }

        // Get sale by UUID
        [Authorize(Roles = "admin, cashier")]
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

        // Get sales by company
        [Authorize(Roles = "admin, cashier")]
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

        // Get receipt by invoice UUID
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