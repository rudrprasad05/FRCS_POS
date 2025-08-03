using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class PosSessionDTO : BaseDTO
    {
        public int PosTerminalId;

        public UserDTO PosUser = new();
        public string PosUserId = null!;
    }
}