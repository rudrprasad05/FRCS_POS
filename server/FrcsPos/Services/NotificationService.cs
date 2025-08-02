using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace FrcsPos.Service
{
    public class NotificationService : INotificationService
    {
        private readonly ApplicationDbContext _context;


        public NotificationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(string title, string message, NotificationType type = NotificationType.INFO, string? actionUrl = null)
        {
            var notification = new Notification
            {
                Title = title,
                Message = message,
                Type = type,
                ActionUrl = actionUrl ?? "#"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }
}