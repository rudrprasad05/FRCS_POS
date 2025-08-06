using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class QuickConnectMobile : BaseModel
    {
        public string Model { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime ConnectionTime { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
    }
}