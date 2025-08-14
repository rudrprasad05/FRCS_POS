using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/company")]
    [ApiController]
    public class CompanyController : BaseController
    {
        private readonly ICompanyRepository _companyRepository;

        public CompanyController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<UserController> logger,
            ICompanyRepository companyRepository
        ) : base(configuration, tokenService, logger)
        {
            _companyRepository = companyRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCompany([FromBody] NewCompanyRequest data)
        {
            var model = await _companyRepository.CreateCompanyAsync(data);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCompanies([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _companyRepository.GetAllCompanyAsync(queryObject);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] string uuid)
        {
            var model = await _companyRepository.SoftDelete(uuid);

            if (model == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }

    }
}