using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class NewPosTerminalRequest
    {
        public string CompanyName { get; set; } = default!;
        public string Name { get; set; } = default!;

    }
}