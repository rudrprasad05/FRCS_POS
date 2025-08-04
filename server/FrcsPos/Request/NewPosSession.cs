using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class NewPosSession
    {
        public string PosUserId { get; set; } = string.Empty;
        public int PosTerminalId { get; set; }

    }
}