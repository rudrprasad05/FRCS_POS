using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class RefundItemDTO : BaseDTO
    {
        public int Id { get; set; }             // RefundItem.Id
        public int SaleItemId { get; set; }
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public int Quantity { get; set; }
        public int? ApprovedQuantity { get; set; }
        public string? Note { get; set; }
    }
}