using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class PosSession : BaseModel
    {
        public PosTerminal PosTerminal = null!;
        public int PosTerminalId;

        public User PosUser = new User();
        public string PosUserId = null!;
 
        [Required] public string ConnectionUUID = default!;
        [Required] public bool IsActive = true;
        public DateTime ConnectionTimeOut = default!;

        public List<Sale> Sales = new List<Sale>();
    }
}