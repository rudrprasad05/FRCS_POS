using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Request
{
    public class AddUserToCompany
    {
        public string UserId { get; set; } = default!;
        public string CompanyUUID { get; set; } = default!;

    }
}