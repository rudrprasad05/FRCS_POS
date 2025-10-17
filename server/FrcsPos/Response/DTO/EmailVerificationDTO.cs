using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class EmailVerificationDTO : BaseDTO
    {
        public string UserId { get; set; } = string.Empty;
        public UserDTO User { get; set; } = null!;
        public string Code { get; set; } = null!;
        public bool IsVerified { get; set; } = false;
        public DateTime UseBy { get; set; }
    }
}