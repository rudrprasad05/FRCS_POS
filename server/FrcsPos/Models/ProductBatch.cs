using System;
using System.Collections.Generic;

namespace FrcsPos.Models
{
    public class ProductBatch : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; } = default!;

        public int Quantity { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
