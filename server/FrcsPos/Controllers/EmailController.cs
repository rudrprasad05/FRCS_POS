using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Services;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    namespace FrcsPos.Controllers
    {
        [ApiController]
        [Route("api/email")]
        public class EmailController : ControllerBase
        {
            private readonly IEmailService _emailService;

            public EmailController(IEmailService emailService)
            {
                _emailService = emailService;
            }

            [HttpPost("send-test")]
            public async Task<IActionResult> SendTestEmail([FromBody] string recipientEmail)
            {
                var html = "<h2>Azure Email Test</h2><p>This is a test email from your FRCS POS app.</p>";

                var success = await _emailService.SendVerifyEmailAsync(recipientEmail, "Azure Email Test", html);

                if (!success)
                    return StatusCode(500, "Failed to send email. Check console logs.");

                return Ok("Email sent successfully!");
            }
        }
    }

}