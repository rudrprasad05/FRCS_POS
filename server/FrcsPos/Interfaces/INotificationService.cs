using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface INotificationService
    {
        public Task CreateBackgroundNotification(NotificationDTO notificationDTO);
    }
}