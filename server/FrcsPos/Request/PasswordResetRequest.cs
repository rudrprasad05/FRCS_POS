using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class PasswordResetRequest
    {
        public string Code { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class RequestPasswordReset
    {
        public string Email { get; set; } = null!;
    }

    public class ChangeUsernameRequest
    {
        public string NewUsername { get; set; } = null!;
    }
}