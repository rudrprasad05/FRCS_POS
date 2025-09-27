using System;
using System.Collections.Generic;

namespace FrcsPos.Models
{
    public class ProductBatch : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = default!;

        public int ProductVariantId { get; set; }
        public ProductVariant ProductVariant { get; set; } = default!;

        public int WarehouseId { get; set; }
        public Warehouse Warehouse { get; set; } = default!;

        public int Quantity { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public DateTime RecievedDate { get; set; }

    }
}
