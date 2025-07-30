using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public enum CompanyRole
    {
        Manager = 1,
        Cashier = 2
    }

    public class CompanyUser : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public int UserId { get; set; }
        public User User { get; set; } = default!;
        
        public CompanyRole Role { get; set; }
    }
}