using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class NewCompanyRequest
    {
        public string Name { get; set; } = string.Empty;
        public string AdminUserId { get; set; } = string.Empty;

    }
}