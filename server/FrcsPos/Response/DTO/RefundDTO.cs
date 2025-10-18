using System;
using System.Collections.Generic;
using FrcsPos.Models;

namespace FrcsPos.Response.DTO
{
    public class RefundDTO
    {
        public int Id { get; set; }
        public string UUID { get; set; } = string.Empty;
        public int CompanyId { get; set; }
        public int SaleId { get; set; }
        public string RequestedByUserId { get; set; } = string.Empty;
        public DateTime CreatedOn { get; set; }
        public string? Reason { get; set; }
        public RefundStatus Status { get; set; } = RefundStatus.PENDING;
        public string? ApprovedByUserId { get; set; }
        public List<RefundItemDTO> Items { get; set; } = new();
        public UserDTO? ApprovedBy { get; set; } = null;
        public UserDTO RequestedBy { get; set; } = default!;
        public SaleDTO? Sale { get; set; }
    }
}
