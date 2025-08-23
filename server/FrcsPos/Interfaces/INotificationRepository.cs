using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface INotificationRepository
    {
        public Task<ApiResponse<List<NotificationDTO>>> GetSuperAdminNotifications(RequestQueryObject queryObject);
        public Task<ApiResponse<List<NotificationDTO>>> GetNotificationByUserId(RequestQueryObject queryObject, string userId);
    }
}