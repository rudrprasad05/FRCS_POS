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
        public async Task<IActionResult> Download([FromQuery] string uuid, [FromBody] RequestPasswordReset requestPasswordReset)
        {
            var model = await _checkoutRepository.EmailReceiptPDF(uuid, requestPasswordReset.Email);

            if (model == null || !model.Success || model.Success == false)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }


    }
}

