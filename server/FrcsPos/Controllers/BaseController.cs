using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected readonly IConfiguration _configuration;
        protected readonly ITokenService _tokenService;
        protected readonly ILogger _logger;


        public BaseController(IConfiguration configuration, ITokenService tokenService, ILogger logger)
        {
            _configuration = configuration;
            _tokenService = tokenService;
            _logger = logger;
        }
        protected string? UserId => HttpContext.Items["UserId"]?.ToString();

        [HttpDelete("{uuid}")]
        public virtual Task<IActionResult> SafeDelete([FromRoute] string uuid)
        {
            return Task.FromResult<IActionResult>(NotFound());
        }
    }
}