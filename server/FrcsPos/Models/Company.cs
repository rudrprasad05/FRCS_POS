using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Company : BaseModel
    {
        public string Name { get; set; } = default!;
        public string AdminUserId { get; set; } = null!;
        public User AdminUser { get; set; } = default!;
        public ICollection<CompanyUser> Users { get; set; } = new List<CompanyUser>();
        public ICollection<Warehouse> Warehouses { get; set; } = new List<Warehouse>();
        public ICollection<PosTerminal> PosTerminals { get; set; } = new List<PosTerminal>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<Supplier> Suppliers { get; set; } = new List<Supplier>();

        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}