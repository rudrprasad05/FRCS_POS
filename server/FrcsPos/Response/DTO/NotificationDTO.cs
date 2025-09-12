using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class NotificationDTO : BaseDTO
    {
        public string Message { get; set; } = default!;
        public string Title { get; set; } = default!;
        public bool IsRead { get; set; } = false;
        public NotificationType Type { get; set; } = NotificationType.INFO;
        public bool IsSuperAdmin { get; set; } = false;
        public string ActionUrl { get; set; } = string.Empty;
        public string? UserId { get; set; }
        public UserDTO? User { get; set; }
        public int? CompanyId { get; set; }
        public CompanyDTO? Company { get; set; }
    }
}