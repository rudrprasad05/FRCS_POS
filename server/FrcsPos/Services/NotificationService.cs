using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Response.DTO;
using FrcsPos.Socket;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;

namespace FrcsPos.Service
{
    public class NotificationService : INotificationService
    {
        private readonly IBackgroundTaskQueue _taskQueue;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<NotificationService> _logger;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NotificationService(
            IHttpContextAccessor httpContextAccessor,
            IBackgroundTaskQueue taskQueue,
            IServiceScopeFactory serviceScopeFactory,
            ILogger<NotificationService> logger,
            IHubContext<NotificationHub> hubContext
        )
        {
            _httpContextAccessor = httpContextAccessor;
            _taskQueue = taskQueue;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
            _hubContext = hubContext;
        }

        public Task CreateBackgroundNotification(NotificationDTO notificationDTO)
        {
            _taskQueue.QueueBackgroundWorkItem(async token =>
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var notification = notificationDTO.FromDTOToModel();

                    context.Notifications.Add(notification);
                    await context.SaveChangesAsync();

                    _logger.LogInformation("Notification queued: {Title}", notificationDTO.Title);

                    var notificationDto = notification.FromModelToDto();
                    string? userId = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                    if (!string.IsNullOrEmpty(userId))
                        await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", notificationDto);
                    else
                        await _hubContext.Clients.All.SendAsync("ReceiveNotification", notificationDto);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error creating background notification: {Title}", notificationDTO.Title);
                }
            });

            // Return immediately
            return Task.CompletedTask;
        }



    }
}