using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        [Required] public DateTime CreatedOn { get; set; } = DateTime.Now;
        [Required] public DateTime UpdatedOn { get; set; } = DateTime.Now;
        [Required] public bool IsDeleted { get; set; } = false;
        public int EmailVerificationId { get; set; }
        public ICollection<EmailVerification> EmailVerifications { get; set; } = null!;
    }

}