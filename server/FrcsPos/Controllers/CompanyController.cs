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

        [Authorize(Roles = "superadmin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateCompany([FromBody] NewCompanyRequest data)
        {
            var model = await _companyRepository.CreateCompanyAsync(data);

            return StatusCode(model.StatusCode, model);
        }

        [Authorize(Roles = "superadmin, admin")]
        [HttpPost("add-user")]
        public async Task<IActionResult> AddUserToCompany([FromBody] AddUserToCompany request)
        {
            var model = await _companyRepository.AddUserToCompanyAsync(request);

            return StatusCode(model.StatusCode, model);
        }

        [Authorize(Roles = "superadmin")]
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCompanies([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _companyRepository.GetAllCompanyAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-one-by-admin-id")]
        public async Task<IActionResult> GetCompanyByAdminUserId([FromQuery] string uuid)
        {
            var model = await _companyRepository.GetCompanyByAdminUserIdAsync(uuid);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-one-by-associated-admin-id")]
        public async Task<IActionResult> GetCompanyByAssociatedAdminUserId([FromQuery] string uuid)
        {
            var model = await _companyRepository.GetCompanyByAssociatedAdminUserIdAsync(uuid);

            return StatusCode(model.StatusCode, model);
        }

        [HttpGet("get-full-by-uuid")]
        public async Task<IActionResult> GetFullCompanyByUUID([FromQuery] string uuid)
        {
            var model = await _companyRepository.GetFullCompanyByUUIDAsync(uuid);

            return StatusCode(model.StatusCode, model);
        }
        [Authorize(Roles = "superadmin, admin")]
        [HttpDelete("remove-user")]
        public async Task<IActionResult> RemoveUser([FromBody] RemoveUserFromCompany request)
        {
            var model = await _companyRepository.RemoveUserAsync(request);

            return StatusCode(model.StatusCode, model);
        }

        [Authorize(Roles = "superadmin, admin")]
        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteCompany([FromQuery] string uuid)
        {
            var model = await _companyRepository.SoftDelete(uuid);

            return StatusCode(model.StatusCode, model);
        }


        [HttpGet("exists")]
        public async Task<IActionResult> CheckCompanyExists([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _companyRepository.Exists(queryObject);

            return StatusCode(model.StatusCode, model);
        }

    }
}