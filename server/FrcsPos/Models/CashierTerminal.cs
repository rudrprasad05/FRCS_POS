using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class CashierTerminal : BaseModel
    {

        public string UserId { get; set; } = null!;
        public User User { get; set; } = default!;

        public int PosTerminalId { get; set; }
        public PosTerminal PosTerminal { get; set; } = default!;

    }
}