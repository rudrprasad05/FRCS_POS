using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class PosSession : BaseModel
    {
        public PosTerminal PosTerminal = new PosTerminal();
        public int PosTerminalId;

        public User PosUser = new User();
        public string PosUserId = null!;

        public List<Sale> Sales = new List<Sale>();
    }
}