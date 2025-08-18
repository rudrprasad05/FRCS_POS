using System; using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Response;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/test")]
    [ApiController]
    public class TestController : BaseController
    {

        public TestController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<TestController> logger // ✅ Use generic ILogger<T>
        ) : base(configuration, tokenService, logger)
        {
        }

        [HttpGet("ping")]
        public async Task<IActionResult> Ping()
        {
            await Task.CompletedTask;
            return Ok(ApiResponse<string>.Ok("pong", "req retrieved", logger: _logger));
        }
    }
}