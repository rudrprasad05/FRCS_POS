using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class EmailVerification : BaseModel
    {
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
        public string Code { get; set; } = null!;
        public bool IsVerified { get; set; } = false;
        public DateTime UseBy { get; set; } = DateTime.UtcNow.AddDays(2);
    }
}