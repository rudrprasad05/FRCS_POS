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

            return StatusCode(model.StatusCode, model);
        }

        [Authorize(Roles = "admin")]
        [HttpGet("get-admin")]
        public async Task<IActionResult> GetAllAdmin([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _notificationRepository.GetAllAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        [Authorize(Roles = "superadmin")]
        [HttpGet("get-superadmin")]
        public async Task<IActionResult> GetAllSuperadmimn([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _notificationRepository.GetAllAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        [Authorize(Roles = "cashier")]
        [HttpGet("get-cashier")]
        public async Task<IActionResult> GetAllcashier([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _notificationRepository.GetAllAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }

        [HttpPost("read")]
        public async Task<IActionResult> MarkReadUnread([FromQuery] RequestQueryObject queryObject)
        {
            var model = await _notificationRepository.MarkReadAsync(queryObject);

            return StatusCode(model.StatusCode, model);
        }
    }
}