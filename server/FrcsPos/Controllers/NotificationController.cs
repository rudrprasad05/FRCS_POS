using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : BaseController
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<NotificationController> logger,
            INotificationRepository notificationRepository
        ) : base(configuration, tokenService, logger)
        {
            _notificationRepository = notificationRepository;
        }

        [HttpGet("get-all-superadmin")]
        public async Task<IActionResult> GetAllNotificationsForSuperAdmin([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _notificationRepository.GetSuperAdminNotifications(queryObject);

            if (model == null || !model.Success)
            {
                return BadRequest("model not gotten");
            }

            return Ok(model);
        }
    }
}