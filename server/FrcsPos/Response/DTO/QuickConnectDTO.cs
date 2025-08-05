using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class QuickConnectDTO : BaseDTO
    {
        public int PosSessionId { get; set; } = 0;
        public PosSessionDTO PosSession { get; set; } = null!;
        public QuickConnectMobile? QuickConnectMobile { get; set; } = null;
        public int? QuickConnectMobileId { get; set; } = null;
    }
}