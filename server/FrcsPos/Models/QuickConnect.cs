using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class QuickConnect : BaseModel
    {
        public int PosSessionId { get; set; } = 0;
        public PosSession PosSession { get; set; } = null!;
        public QuickConnectMobile? QuickConnectMobile { get; set; } = null;
        public int? QuickConnectMobileId { get; set; } = null;
    }
}