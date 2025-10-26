using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
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
        private readonly IRefundMapper _refundMapper;
        private readonly UserManager<User> _userManager;
        private readonly IRedisCacheService _redisCacheService;

        public RefundRepository(
            ApplicationDbContext context,
            INotificationService notificationService,
            UserManager<User> userManager,
            IRedisCacheService redisCacheService,
            IRefundMapper refundMapper
        )
        {
            _context = context;
            _notificationService = notificationService;
            _userManager = userManager;
            _refundMapper = refundMapper;
            _redisCacheService = redisCacheService;
        }

        public async Task<ApiResponse<RefundDTO>> StartRefundAsync(StartRefundRequest request, string cashierUserId)
        {
            var sale = await _context.Sales
                .Include(s => s.Items)
                    .ThenInclude(si => si.ProductVariant)
                        .ThenInclude(p => p.Batches)
                .FirstOrDefaultAsync(s => s.UUID == request.SaleId);

            if (sale == null)
            {
                return ApiResponse<RefundDTO>.Fail(message: "Sale not found");
            }

            var requestedBy = await _userManager.FindByIdAsync(cashierUserId);
            if (requestedBy == null)
            {
                return ApiResponse<RefundDTO>.Fail(message: "User not found");
            }

            foreach (var ri in request.Items)
            {
                var saleItem = sale.Items.FirstOrDefault(si => si.Id == ri.SaleItemId);
                if (saleItem == null)
                    return ApiResponse<RefundDTO>.Fail(message: "Product not in sale");
                if (ri.Quantity > saleItem.Quantity)
                    return ApiResponse<RefundDTO>.Fail(message: $"Cannot refund more than purchased quantity for {saleItem.ProductVariant.Name}");
            }

            // todo: add role check to requested by

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
                IsSuperAdmin = false,
                CompanyId = sale.CompanyId
            };
            FireAndForget.Run(_notificationService.CreateBackgroundNotification(notification));


            return ApiResponse<RefundDTO>.Ok(await _refundMapper.FromModelToDtoAsync(refund));
        }

        public async Task<ApiResponse<RefundDTO>> GetRefundByIdAsync(int refundId)
        {
            var refund = await _context.RefundRequests
                .Include(r => r.Items)
                    .ThenInclude(i => i.SaleItem)
                        .ThenInclude(si => si.ProductVariant)
                            .ThenInclude(p => p.Batches)
                .FirstOrDefaultAsync(r => r.Id == refundId);

            if (refund == null)
                return ApiResponse<RefundDTO>.Fail(message: "Refund not found");

            return ApiResponse<RefundDTO>.Ok(await _refundMapper.FromModelToDtoAsync(refund));
        }

        public async Task<ApiResponse<List<RefundDTO>>> GetAllRefundsAsync(RequestQueryObject query)
        {
            var q = _context.RefundRequests
                .Include(r => r.Items)
                    .ThenInclude(i => i.SaleItem)
                        .ThenInclude(si => si.ProductVariant)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var s = query.Search.ToLower();
                q = q.Where(r => r.UUID.ToLower().Contains(s) || r.Sale.InvoiceNumber.ToLower().Contains(s));
            }

            var total = await q.CountAsync();
            var skip = (query.PageNumber - 1) * query.PageSize;
            var items = await q.Skip(skip).Take(query.PageSize).ToListAsync();


            var dtos = await _refundMapper.FromModelToDtoAsync(items);


            return new ApiResponse<List<RefundDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = dtos,
                Meta = new MetaData { TotalCount = total, PageNumber = query.PageNumber, PageSize = query.PageSize }
            };
        }

        public async Task<ApiResponse<RefundDTO>> ApproveRefundAsync(RequestQueryObject requestQuery, AdminApprovalRequest request)
        {
            var refund = await _context.RefundRequests
                .Include(r => r.Sale)
                    .ThenInclude(s => s.Company)
                .Include(r => r.Sale)
                    .ThenInclude(s => s.Items)               // <-- SaleItems
                        .ThenInclude(si => si.ProductVariant)
                            .ThenInclude(pv => pv.Batches)
                .Include(r => r.Items)
                    .ThenInclude(i => i.SaleItem)
                        .ThenInclude(si => si.ProductVariant)
                            .ThenInclude(pv => pv.Batches)
                .FirstOrDefaultAsync(r => r.UUID == requestQuery.UUID);

            if (refund == null)
                return ApiResponse<RefundDTO>.Fail(message: "Refund not found");

            if (refund.Status != RefundStatus.PENDING)
                return ApiResponse<RefundDTO>.Fail(message: "Refund already processed");

            var admin = await _userManager.FindByNameAsync(request.AdminUsernameOrEmail) ?? await _userManager.FindByEmailAsync(request.AdminUsernameOrEmail);

            if (admin == null || !await _userManager.CheckPasswordAsync(admin, request.AdminPassword))
                return ApiResponse<RefundDTO>.Fail(message: "Invalid Credentials");

            if (!await _userManager.IsInRoleAsync(admin, "admin"))
                return ApiResponse<RefundDTO>.Fail(message: "Admin creds required");

            foreach (var refundItem in refund.Items)
            {
                var saleItem = refundItem.SaleItem;
                if (saleItem == null)
                    return ApiResponse<RefundDTO>.Fail(message: "Sale item not found");

                if (saleItem.Quantity < refundItem.Quantity)
                    return ApiResponse<RefundDTO>.Fail(message: $"Cannot refund {refundItem.Quantity} of item {saleItem.Id} only {saleItem.Quantity} available.");

                saleItem.Quantity -= refundItem.Quantity;
                var subtotal = saleItem.Quantity * saleItem.UnitPrice;
                var tax = subtotal * saleItem.TaxRatePercent / 100;
                saleItem.LineTotal = subtotal + tax;

                var remaining = refundItem.Quantity;
                foreach (var batch in saleItem.ProductVariant.Batches
                    .OrderBy(b => b.ExpiryDate ?? DateTime.MaxValue))
                {
                    batch.Quantity += remaining;
                    remaining = 0;
                    _context.ProductBatches.Update(batch);
                    break;
                }

                refundItem.ApprovedQuantity = refundItem.Quantity;
            }

            RecomputeSaleTotals(refund.Sale);

            Sale sale = refund.Sale;

            var invoiceNumber = $"{sale.Company.Name[0..2]}-{DateTime.UtcNow:yyyyMMddHHmmss}";

            string newCacheKey = $"receipt:{sale.InvoiceNumber}";
            string oldCacheKey = $"receipt:{sale.InvoiceNumber}";

            sale.InvoiceNumber = invoiceNumber;
            refund.Status = RefundStatus.APPROVED;
            refund.ApprovedByUserId = admin.Id;

            _context.RefundRequests.Update(refund);
            _context.Sales.Update(refund.Sale);

            await _context.SaveChangesAsync();
            await _redisCacheService.SetAsync(newCacheKey, sale);
            await _redisCacheService.RemoveAsync(oldCacheKey);

            return ApiResponse<RefundDTO>.Ok(await _refundMapper.FromModelToDtoAsync(refund));
        }
        private void RecomputeSaleTotals(Sale sale)
        {
            // EF Core will track the SaleItems that are already loaded
            sale.TaxTotal = sale.Items.Sum(i => i.UnitPrice * i.Quantity * i.TaxRatePercent / 100);
            sale.Subtotal = sale.Items.Sum(i => i.UnitPrice * i.Quantity);
            sale.Total = sale.Subtotal + sale.TaxTotal;
        }

        public async Task<ApiResponse<RefundDTO>> GetRefundByUUIDAsync(RequestQueryObject query)
        {
            var refund = await _context.RefundRequests
                .Include(si => si.RequestedBy)
                .Include(si => si.Sale)
                .Include(si => si.Items)
                    .ThenInclude(x => x.SaleItem)
                        .ThenInclude(si => si.ProductVariant)
                            .ThenInclude(x => x.Media)
                .Include(si => si.Items)
                    .ThenInclude(x => x.SaleItem)
                        .ThenInclude(si => si.ProductVariant)
                            .ThenInclude(x => x.Product)
                                .ThenInclude(x => x.TaxCategory)
                .FirstOrDefaultAsync(x => x.UUID == query.UUID);

            if (refund == null)
            {
                return ApiResponse<RefundDTO>.Fail(message: "no refund found");
            }

            var dto = await _refundMapper.FromModelToDtoAsync(refund);

            return ApiResponse<RefundDTO>.Ok(dto);
        }

        public async Task<ApiResponse<RefundDTO>> RejectRefundAsync(RequestQueryObject requestQuery, AdminApprovalRequest request)
        {
            var refund = await _context.RefundRequests
                .Include(r => r.Items)
                    .ThenInclude(i => i.SaleItem)
                        .ThenInclude(si => si.ProductVariant)
                            .ThenInclude(p => p.Batches)
                .FirstOrDefaultAsync(r => r.UUID == requestQuery.UUID);

            if (refund == null) return ApiResponse<RefundDTO>.Fail(message: "Refund not found");
            if (refund.Status == RefundStatus.REJECTED) return ApiResponse<RefundDTO>.Fail(message: "Refund already processed");

            var admin = await _userManager.FindByNameAsync(request.AdminUsernameOrEmail)
                        ?? await _userManager.FindByEmailAsync(request.AdminUsernameOrEmail);

            if (admin == null) return ApiResponse<RefundDTO>.Fail(message: "Invalid Credentials");
            var ok = await _userManager.CheckPasswordAsync(admin, request.AdminPassword);
            if (!ok) return ApiResponse<RefundDTO>.Fail(message: "Invalid Credentials");

            var roles = await _userManager.GetRolesAsync(admin);
            var isAdmin = roles.Contains("admin");
            if (!isAdmin)
            {
                return ApiResponse<RefundDTO>.Fail(message: "Admin creds required");
            }

            refund.Status = RefundStatus.REJECTED;
            refund.ApprovedByUserId = admin.Id;
            _context.RefundRequests.Update(refund);
            await _context.SaveChangesAsync();

            return ApiResponse<RefundDTO>.Ok(await _refundMapper.FromModelToDtoAsync(refund));
        }
    }
}
