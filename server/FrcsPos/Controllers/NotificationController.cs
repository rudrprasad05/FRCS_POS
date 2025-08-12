using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    public class NotificationController : BaseController
    {
        private readonly ICompanyRepository _companyRepository;

        public NotificationController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<NotificationController> logger,
            ICompanyRepository companyRepository
        ) : base(configuration, tokenService, logger)
        {
            _companyRepository = companyRepository;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCompanies([FromQuery] RequestQueryObject queryObject)
        {
            
            // TODO
            return Ok();
        }
    }
}