using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class Notification : BaseModel
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public NotificationType Type { get; set; } = NotificationType.INFO;
        public string? UserId { get; set; }
        public User? User { get; set; }
        public int? CompanyId { get; set; }
        public Company? Company { get; set; }
        public bool IsSuperAdmin { get; set; } = false;
        public string ActionUrl { get; set; } = string.Empty;
    }

    public enum NotificationType
    {
        INFO,
        WARNING,
        ERROR,
        SUCCESS
    }

}
