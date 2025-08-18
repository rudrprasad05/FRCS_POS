using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FrcsPos.Request
{
    public class NewProductBatchRequest
    {
        [Required]
        public int CompanyId { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public int WarehouseId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
    }
    
    public class UpdateProductBatchRequest
    {
        [Required]
        public string UUID { get; set; } = string.Empty;
        
        [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative")]
        public int Quantity { get; set; }
        
        public DateTime? ExpiryDate { get; set; }
    }
    
    public class NewStockTransferRequest
    {
        [Required]
        public int CompanyId { get; set; }
        
        [Required]
        public int SourceWarehouseId { get; set; }
        
        [Required]
        public int DestinationWarehouseId { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
        public int Quantity { get; set; }
        
        public string Notes { get; set; } = string.Empty;
        
        [Required]
        public string TransferredByUserId { get; set; } = string.Empty;
    }
}