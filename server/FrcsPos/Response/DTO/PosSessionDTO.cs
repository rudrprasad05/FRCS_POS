using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class PosSessionDTO : BaseDTO
    {
        public int PosTerminalId;
        [Required] public string ConnectionUUID = default!;
        public DateTime ConnectionTimeOut = default!;

        public UserDTO PosUser = new();
        public string PosUserId = null!;
    }
}