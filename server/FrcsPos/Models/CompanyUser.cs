using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public enum CompanyRole
    {
        MANAGER,
        CASHIER
    }

    public class CompanyUser : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public string UserId { get; set; } = null!;
        public User User { get; set; } = default!;

        public CompanyRole Role { get; set; }

        public List<PosSession> PosSessions { get; set; } = [];
    }
}