using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace FrcsPos.Models
{
    public class User : IdentityUser
    {
        public ICollection<CompanyUser> Companies { get; set; } = [];
        public ICollection<Sale> SalesAsCashier { get; set; } = [];
        public ICollection<PosSession> PosSessions { get; set; } = [];
    }
}