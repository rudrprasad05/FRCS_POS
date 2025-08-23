using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Interfaces
{
    public interface INotificationService
    {
        public Task CreateBackgroundNotification(string title, string message, NotificationType type = NotificationType.INFO, bool isSuperAdmin = false, string? actionUrl = null, string? userId = null, int? companyId = null);
    }
}