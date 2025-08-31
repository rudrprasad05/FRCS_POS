using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
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
    public class CheckoutRepository : ICheckoutRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly UserManager<User> _userManager;

        public CheckoutRepository(
            ApplicationDbContext applicationDbContext,
            INotificationService notificationService,
            UserManager<User> userManager
        )
        {
            _userManager = userManager;
            _context = applicationDbContext;
            _notificationService = notificationService;
        }

        public async Task<ApiResponse<SaleDTO>> CreateCheckoutAsync(NewCheckoutRequest request)
        {
            // verify company exists
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.Name == request.CompanyName);
            if (company == null)
                return ApiResponse<SaleDTO>.Fail(message: "Company not found");

            // verify session exists
            var session = await _context.PosSessions
                .FirstOrDefaultAsync(ps => ps.Id == request.PosSessionId && ps.IsActive == true);
            if (session == null)
                return ApiResponse<SaleDTO>.Fail(message: "POS session not found");

            // verify cashier exists
            var cashier = await _userManager
                .FindByIdAsync(request.CashierId);
            if (cashier == null)
                return ApiResponse<SaleDTO>.Fail(message: "Cashier not found");


            var saleItems = request.Items.Select(i =>
            {
                var item = new SaleItem();

                item.ProductId = i.ProductId;
                item.Quantity = i.Quantity;
                item.UnitPrice = i.UnitPrice;
                item.LineTotal = i.LineTotal;

                return item;
            }).ToList();

            // Generate InvoiceNumber (example: CompanyID-YYYYMMDD-HHMMSS)
            var invoiceNumber = $"{request.CompanyName[0..2]}-{DateTime.UtcNow:yyyyMMddHHmmss}";

            // Create Sale
            var sale = new Sale
            {
                CompanyId = company.Id,
                Company = company,
                PosSessionId = session.Id,
                PosSession = session,
                CashierId = cashier.Id,
                Cashier = cashier,
                InvoiceNumber = invoiceNumber,
                Subtotal = request.Subtotal,
                TaxTotal = request.TaxTotal,
                Total = request.Total,
                Status = SaleStatus.PENDING,
                Items = saleItems
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            return ApiResponse<SaleDTO>.Ok(sale.FromModelToDto());
        }
        public async Task<ApiResponse<SaleDTO>> GetByUUIDAsync(string uuid)
        {
            {
                var sale = await _context.Sales
                    .Include(s => s.Company)
                    .Include(s => s.Items)
                        .ThenInclude(si => si.Product)
                            .ThenInclude(p => p.TaxCategory)
                    .Include(s => s.PosSession)
                        .ThenInclude(ps => ps.PosTerminal)
                    .Include(s => s.Cashier)
                    .FirstOrDefaultAsync(s => s.UUID == uuid);

                if (sale == null)
                    return ApiResponse<SaleDTO>.NotFound(message: "Sale not found");
                if (sale.Company == null)
                    return ApiResponse<SaleDTO>.NotFound(message: "Company not found");

                return ApiResponse<SaleDTO>.Ok(sale.FromModelToDto());
            }
        }

        public async Task<ApiResponse<string>> GenerateReceiptPDF(string uuid)
        {
            return ApiResponse<string>.Ok("ok");
        }
    }
}