using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class SuperAdminDashboardDTO
    {
        public int TotalCompanies { get; set; }
        public long TotalMedia { get; set; }
        public int TotalUsers { get; set; }
        public int TotalProducts { get; set; }
        public int TotalSales { get; set; }
        public long TotalVat { get; set; }
        public List<NotificationDTO> Notifications { get; set; } = new();

    }

    public class AdminDashboardDTO
    {
        public int TotalCompanies { get; set; }
        public int TotalUsers { get; set; }
        public int TotalProducts { get; set; }
        public long TotalMedia { get; set; }
        public int TotalSales { get; set; }

        public List<NotificationDTO> Notifications { get; set; } = new();

    }
}