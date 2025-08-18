using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Models
{
    public class StockTransfer : BaseModel
    {
        public int CompanyId { get; set; }
        public Company Company { get; set; } = default!;
        
        public int SourceWarehouseId { get; set; }
        public Warehouse SourceWarehouse { get; set; } = default!;
        
        public int DestinationWarehouseId { get; set; }
        public Warehouse DestinationWarehouse { get; set; } = default!;
        
        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;
        
        public int Quantity { get; set; }
        public string? Notes { get; set; }
        
        public string TransferredByUserId { get; set; } = null!;
        public User TransferredByUser { get; set; } = default!;
    }
}