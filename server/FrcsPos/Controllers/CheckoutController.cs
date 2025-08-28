using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/checkout")]
    [ApiController]
    public class CheckoutController : BaseController
    {
        private readonly ICompanyRepository _companyRepository;

        public CheckoutController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            ICompanyRepository companyRepository
        ) : base(configuration, tokenService, logger)
        {
            _companyRepository = companyRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCheckout([FromBody] NewCompanyRequest data)
        {
            var model = await _companyRepository.CreateCompanyAsync(data);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }


    }
}