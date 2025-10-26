using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using FrcsPos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/checkout")]
    [ApiController]
    public class CheckoutController : BaseController
    {
        private readonly ICheckoutRepository _checkoutRepository;

        public CheckoutController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            ICheckoutRepository checkoutRepository
        ) : base(configuration, tokenService, logger)
        {
            _checkoutRepository = checkoutRepository;
        }

        [Authorize(Roles = "admin, cashier")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateCheckout([FromBody] NewCheckoutRequest data)
        {
            var model = await _checkoutRepository.CreateCheckoutAsync(data);

            if (model == null || !model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpGet("download-receipt")]
        public async Task<IActionResult> Download([FromQuery] string uuid)
        {
            var model = await _checkoutRepository.GenerateReceiptPDF(uuid);

            if (model == null || !model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        [HttpPost("email-receipt")]
        public async Task<IActionResult> Download([FromQuery] RequestQueryObject requestQueryObject, [FromBody] RequestPasswordReset requestPasswordReset)
        {
            if (requestQueryObject.UUID == null)
            {
                return BadRequest(ApiResponse<bool>.Fail(message: "Sale not found"));
            }
            var model = await _checkoutRepository.EmailReceiptPDF(requestQueryObject.UUID, requestPasswordReset.Email);

            if (model == null || !model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }


    }
}

