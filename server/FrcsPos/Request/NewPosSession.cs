using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class NewPosSession
    {
        public string PosUserId { get; set; } = string.Empty;
        public string PosTerminalUUID { get; set; } = default!;

    }

    public class CreateNewPosSession
    {
        public string PosTerminalUUID { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}