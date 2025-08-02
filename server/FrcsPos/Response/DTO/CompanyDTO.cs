using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public class CompanyDTO : BaseDTO
    {
        public string Name { get; set; } = default!;
        public UserDTO AdminUser { get; set; } = default!;
    }
}