using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class RefundRepository : IRefundRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly UserManager<User> _userManager;

        public RefundRepository(
            ApplicationDbContext context,
            INotificationService notificationService,
            UserManager<User> userManager
        )
        {
            _context = context;
            _notificationService = notificationService;
            _userManager = userManager;
        }

        public async Task<ApiResponse<RefundDTO>> StartRefundAsync(StartRefundRequest request, string cashierUserId)
        {
            var sale = await _context.Sales
                .Include(s => s.Items)
                    .ThenInclude(si => si.Product)
                        .ThenInclude(p => p.Batches)
                .FirstOrDefaultAsync(s => s.Id == request.SaleId);

            if (sale == null)
                return ApiResponse<RefundDTO>.Fail(message: "Sale not found");

            foreach (var ri in request.Items)
            {
                var saleItem = sale.Items.FirstOrDefault(si => si.Id == ri.SaleItemId);
                if (saleItem == null)
                    return ApiResponse<RefundDTO>.Fail(message: "Product not in sale");
                if (ri.Quantity > saleItem.Quantity)
                    return ApiResponse<RefundDTO>.Fail(message: $"Cannot refund more than purchased quantity for {saleItem.Product.Name}");
            }

            var refund = new RefundRequest
            {
                CompanyId = sale.CompanyId,
                SaleId = sale.Id,
                RequestedByUserId = cashierUserId,
                Reason = request.Reason,
                Status = RefundStatus.PENDING,
                CreatedOn = DateTime.UtcNow
            };

            foreach (var ri in request.Items)
            {
                refund.Items.Add(new RefundItem
                {
                    SaleItemId = ri.SaleItemId,
                    Quantity = ri.Quantity,
                    Note = ri.Note
                });
            }

            await _context.RefundRequests.AddAsync(refund);
            await _context.SaveChangesAsync();

            var notification = new NotificationDTO
            {
                Title = "Refund Requested",
                Message = $"Refund requested for Sale #{sale.Id}",
                Type = NotificationType.INFO,
                ActionUrl = $"/admin/refunds/{refund.Id}",
                IsSuperAdmin = true,
                CompanyId = sale.CompanyId
            };
            FireAndForget.Run(_notificationService.CreateBackgroundNotification(notification));


            return ApiResponse<RefundDTO>.Ok(MapRefundToDTO(refund));
        }

        public async Task<ApiResponse<RefundDTO>> GetRefundByIdAsync(int refundId)
        {
            var refund = await _context.RefundRequests
                .Include(r => r.Items)
                    .ThenInclude(i => i.SaleItem)
                        .ThenInclude(si => si.Product)
                            .ThenInclude(p => p.Batches)
                .FirstOrDefaultAsync(r => r.Id == refundId);

            if (refund == null)
                return ApiResponse<RefundDTO>.Fail(message: "Refund not found");

            return ApiResponse<RefundDTO>.Ok(MapRefundToDTO(refund));
        }

        public async Task<ApiResponse<List<RefundDTO>>> GetAllRefundsAsync(RequestQueryObject query)
        {
            var q = _context.RefundRequests
                .Include(r => r.Items)
                    .ThenInclude(i => i.SaleItem)
                        .ThenInclude(si => si.Product)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.ToLower();
                q = q.Where(r => r.UUID.ToLower().Contains(s) || r.Sale.InvoiceNumber.ToLower().Contains(s));
            }

            var total = await q.CountAsync();
            var skip = (query.PageNumber - 1) * query.PageSize;
            var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();

            var dtos = items.Select(MapRefundToDTO).ToList();

            return new ApiResponse<List<RefundDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = dtos,
                Meta = new MetaData { TotalCount = total, PageNumber = query.PageNumber, PageSize = query.PageSize }
            };
        }

        public async Task<ApiResponse<RefundDTO>> ApproveRefundAsync(int refundId, AdminApprovalRequest request)
        {
            var refund = await _context.RefundRequests
                .Include(r => r.Items)
                    .ThenInclude(i => i.SaleItem)
                        .ThenInclude(si => si.Product)
                            .ThenInclude(p => p.Batches)
                .FirstOrDefaultAsync(r => r.Id == refundId);

            if (refund == null) return ApiResponse<RefundDTO>.Fail(message: "Refund not found");
            if (refund.Status != RefundStatus.PENDING) return ApiResponse<RefundDTO>.Fail(message: "Refund already processed");

            var admin = await _userManager.FindByNameAsync(request.AdminUsernameOrEmail)
                        ?? await _userManager.FindByEmailAsync(request.AdminUsernameOrEmail);

            if (admin == null) return ApiResponse<RefundDTO>.Fail(message: "Invalid Credentials");
            var ok = await _userManager.CheckPasswordAsync(admin, request.AdminPassword);
            if (!ok) return ApiResponse<RefundDTO>.Fail(message: "Invalid Credentials");

            var claims = await _userManager.GetClaimsAsync(admin);
            var roleClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
            if (roleClaim == null || (roleClaim.Value != "ADMIN" && roleClaim.Value != "MANAGER"))
                return ApiResponse<RefundDTO>.Fail(message: "Admin privileges required");

            // Restock items by updating ProductBatch quantities
            foreach (var item in refund.Items)
            {
                var saleItem = await _context.SaleItems
                    .Include(si => si.Product)
                        .ThenInclude(p => p.Batches)
                    .FirstOrDefaultAsync(si => si.Id == item.SaleItemId);

                if (saleItem == null) return ApiResponse<RefundDTO>.Fail(message: "Sale item not found");

                var remainingQty = item.Quantity;
                var batches = saleItem.Product.Batches
                    .OrderBy(b => b.ExpiryDate ?? DateTime.MaxValue)
                    .ToList();

                foreach (var batch in batches)
                {
                    batch.Quantity += remainingQty;
                    remainingQty = 0;
                    _context.ProductBatches.Update(batch);
                    break; // For simplicity, add to first batch
                }

                item.ApprovedQuantity = item.Quantity;
            }

            refund.Status = RefundStatus.APPROVED;
            refund.ApprovedByUserId = admin.Id;
            _context.RefundRequests.Update(refund);
            await _context.SaveChangesAsync();

            return ApiResponse<RefundDTO>.Ok(MapRefundToDTO(refund));
        }

        private RefundDTO MapRefundToDTO(RefundRequest refund)
        {
            return new RefundDTO
            {
                Id = refund.Id,
                UUID = refund.UUID,
                CompanyId = refund.CompanyId,
                SaleId = refund.SaleId,
                RequestedByUserId = refund.RequestedByUserId,
                CreatedOn = refund.CreatedOn,
                Reason = refund.Reason,
                Status = refund.Status.ToString(),
                ApprovedByUserId = refund.ApprovedByUserId,
                Items = refund.Items.Select(i => new RefundItemDTO
                {
                    Id = i.Id,
                    SaleItemId = i.SaleItemId,
                    ProductId = i.SaleItem?.ProductId ?? 0,
                    ProductName = i.SaleItem?.Product?.Name,
                    Quantity = i.Quantity,
                    ApprovedQuantity = i.ApprovedQuantity,
                    Note = i.Note
                }).ToList()
            };
        }
    }
}
