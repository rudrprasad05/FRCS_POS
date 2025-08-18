using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class CompanyUserDTO : BaseDTO
    {
        public int CompanyId { get; set; }

        public string UserId { get; set; } = null!;
        public UserDTO User { get; set; } = default!;
    }
}