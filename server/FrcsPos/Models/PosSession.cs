using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class PosSession : BaseModel
    {
        public PosTerminal PosTerminal { get; set; } = default!;
        public int PosTerminalId { get; set; }

        public User PosUser { get; set; } = default!;
        public string PosUserId { get; set; } = default!;

        [Required]
        public string ConnectionUUID { get; set; } = default!;
        [Required]
        public bool IsActive { get; set; } = true;
        public DateTime ConnectionTimeOut { get; set; } = DateTime.UtcNow.AddHours(8);

        public List<Sale> Sales { get; set; } = [];
    }
}