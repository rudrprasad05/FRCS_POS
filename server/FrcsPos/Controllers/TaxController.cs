using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using FrcsPos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    // Tax category management controller
    [Authorize]
    [Route("api/tax")]
    [ApiController]
    public class TaxController : BaseController
    {
        private readonly ITaxCategoryRepository _taxRepository;

        // Constructor to inject dependencies
        public TaxController(
            ITokenService tokenService,
            ITaxCategoryRepository taxRepository,
            IConfiguration configuration,
            ILogger<UserController> logger,
            ICompanyRepository companyRepository
        ) : base(configuration, tokenService, logger)
        {
            _taxRepository = taxRepository;
        }

        // Get all tax 
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllTax([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _taxRepository.GetAllTaxCategories(queryObject);
            if (!model.Success) return BadRequest(model);

            return Ok(model);
        }

        // Get tax by UUID
        [HttpGet("get-by-uuid")]
        public async Task<IActionResult> GetOne([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _taxRepository.GetOneAsync(queryObject);
            if (!model.Success) return BadRequest(model);

            return Ok(model);
        }

        // Create new tax 
        [Authorize(Roles = "superadmin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateTax([FromBody] NewTaxRequest request)
        {
            if (request == null) return BadRequest("Invalid request data");
            var model = await _taxRepository.CreateTaxCategoryAsync(request);
            if (!model.Success) return BadRequest(model);
            return Ok(model);
        }

        // Edit tax 
        [Authorize(Roles = "superadmin")]
        [HttpPost("edit")]
        public async Task<IActionResult> EditTax([FromBody] NewTaxRequest request, [FromQuery] RequestQueryObject queryObject)
        {
            if (request == null) return BadRequest("Invalid request data");
            var model = await _taxRepository.EditTaxAsync(request, queryObject);
            if (!model.Success) return BadRequest(model);
            return Ok(model);
        }

        // Soft delete tax 
        [Authorize(Roles = "superadmin")]
        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteTax([FromQuery] string uuid)
        {
            if (string.IsNullOrWhiteSpace(uuid))
                return BadRequest(ApiResponse<string>.Fail(message: "invalid uuid"));
            var model = await _taxRepository.SoftDelete(uuid);
            if (!model.Success) return BadRequest(model);
            return Ok(model);
        }

        // Activate tax
        [Authorize(Roles = "superadmin")]
        [HttpPatch("activate")]
        public async Task<IActionResult> Activate([FromQuery] string uuid)
        {
            if (string.IsNullOrWhiteSpace(uuid))
                return BadRequest(ApiResponse<string>.Fail(message: "invalid uuid"));
            var model = await _taxRepository.ActivateAsync(uuid);
            if (!model.Success) return BadRequest(model);
            return Ok(model);
        }
    }
}
