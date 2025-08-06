using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class PosSessionDTO : BaseDTO
    {
        public int PosTerminalId { get; set; }
        public PosTerminalDTO PosTerminal { get; set; } = default!;

        [Required] public string ConnectionUUID { get; set; } = default!;
        public DateTime ConnectionTimeOut { get; set; } = default!;

        public UserDTO PosUser { get; set; } = default!;
        public string PosUserId { get; set; } = null!;
    }

}