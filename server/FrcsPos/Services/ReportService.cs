using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;

        public ReportService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<SalesSummaryDTO>> GetDailySalesAsync(DateTime date)
        {
            var start = date.Date;
            var end = start.AddDays(1);

            var sales = await _context.Sales
                .Include(s => s.Items)
                .Where(s => s.CreatedOn >= start && s.CreatedOn < end)
                .ToListAsync();

            if (!sales.Any())
            {
                return new ApiResponse<SalesSummaryDTO>
                {
                    Success = false,
                    StatusCode = 404,
                    Message = "No sales found for this date."
                };
            }

            var totalSales = sales.Sum(s => s.Total);
            var totalItems = sales.Sum(s => s.Items.Sum(i => i.Quantity));

            var summary = new SalesSummaryDTO
            {
                Date = date,
                TotalSales = totalSales,
                TotalItemsSold = totalItems
            };

            return new ApiResponse<SalesSummaryDTO>
            {
                Data = summary,
                Message = "Daily sales summary retrieved successfully."
            };
        }

        public async Task<ApiResponse<AnnualSalesDTO>> GetAnnualSalesAsync(int year)
        {
            var sales = await _context.Sales
                .Include(s => s.Items)
                .Where(s => s.CreatedOn.Year == year)
                .ToListAsync();

            if (!sales.Any())
            {
                return new ApiResponse<AnnualSalesDTO>
                {
                    Success = false,
                    StatusCode = 404,
                    Message = "No sales found for this year."
                };
            }

            var totalSales = sales.Sum(s => s.Total);

            var monthly = sales
                .GroupBy(s => s.CreatedOn.Month)
                .Select(g => new MonthlySalesDTO
                {
                    Month = g.Key,
                    TotalSales = g.Sum(s => s.Total)
                })
                .OrderBy(m => m.Month)
                .ToList();

            var annualReport = new AnnualSalesDTO
            {
                Year = year,
                TotalSales = totalSales,
                MonthlySales = monthly
            };

            return new ApiResponse<AnnualSalesDTO>
            {
                Data = annualReport,
                Message = "Annual sales summary retrieved successfully."
            };
        }

        public async Task<ApiResponse<List<TopProductDTO>>> GetTopProductsAsync(int limit = 5)
        {
            var topProducts = await _context.SaleItems
                .Include(si => si.ProductVariant)
                .GroupBy(si => new { si.ProductVariantId, si.ProductVariant.Name })
                .Select(g => new TopProductDTO
                {
                    ProductVariantId = g.Key.ProductVariantId,
                    ProductName = g.Key.Name,
                    QuantitySold = g.Sum(si => si.Quantity),
                    TotalRevenue = g.Sum(si => si.Quantity * si.UnitPrice)
                })
                .OrderByDescending(p => p.QuantitySold)
                .Take(limit)
                .ToListAsync();

            return new ApiResponse<List<TopProductDTO>>
            {
                Data = topProducts,
                Message = "Top products retrieved successfully."
            };
        }

        public async Task<ApiResponse<List<StockLevelDTO>>> GetStockLevelsAsync()
        {
            var stock = await _context.ProductBatches
                .Include(b => b.ProductVariant)
                .Include(b => b.Warehouse)
                .GroupBy(b => new { b.ProductVariantId, b.ProductVariant.Name, Warehouse = b.Warehouse.Name })
                .Select(g => new StockLevelDTO
                {
                    ProductVariantId = g.Key.ProductVariantId,
                    ProductName = g.Key.Name,
                    WarehouseName = g.Key.Warehouse,
                    TotalStock = g.Sum(b => b.Quantity)
                })
                .ToListAsync();

            return new ApiResponse<List<StockLevelDTO>>
            {
                Data = stock,
                Message = "Stock levels retrieved successfully."
            };
        }
    }
}
