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
        private readonly ITaxCategoryRepository _taxRepository;

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

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllTax([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _taxRepository.GetAllTaxCategories(queryObject);
            if (!model.Success) return BadRequest(model);

            return Ok(model);
        }

        [HttpGet("get-by-uuid")]
        public async Task<IActionResult> GetOne([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _taxRepository.GetOneAsync(queryObject);
            if (!model.Success) return BadRequest(model);

            return Ok(model);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateTax([FromBody] NewTaxRequest request)
        {
            if (request == null) return BadRequest("Invalid request data");
            var model = await _taxRepository.CreateTaxCategoryAsync(request);
            if (!model.Success) return BadRequest(model);
            return Ok(model);
        }

        [HttpDelete("soft-delete")]
        public async Task<IActionResult> SoftDeleteTax([FromQuery] string uuid)
        {
            if (string.IsNullOrWhiteSpace(uuid)) return BadRequest("UUID is required");
            var model = await _taxRepository.SoftDelete(uuid);
            if (!model.Success) return BadRequest(model);
            return Ok(model);
        }
    }
}
