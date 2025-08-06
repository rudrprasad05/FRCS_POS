using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class NewPosTerminalRequest
    {
        public int CompanyId { get; set; }
        public string Name { get; set; } = string.Empty;

    }
}