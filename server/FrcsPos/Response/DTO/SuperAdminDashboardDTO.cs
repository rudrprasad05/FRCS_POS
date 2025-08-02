using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class SuperAdminDashboardDTO
    {
        public List<UserDTO> Users { get; set; } = [];
        public List<CompanyDTO> Companies { get; set; } = [];
        
    }
}