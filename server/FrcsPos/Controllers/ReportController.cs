using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Controllers
{
    // DTOs
    public class MonthlySalesReportDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; } = default!;
        public decimal TotalSales { get; set; }
        public int SaleCount { get; set; }
    }

    public class MonthlyTaxReportDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; } = default!;
        public decimal TaxDue { get; set; }
    }

    // Controller
    [ApiController]
    [Authorize]
    [Route("api/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("sales-last-12-months")]
        public async Task<ActionResult<ApiResponse<List<MonthlySalesReportDto>>>> GetSalesLast12Months([FromQuery] RequestQueryObject query)
        {
            var endDate = DateTime.UtcNow;
            var startDate = endDate.AddMonths(-11).Date; // Last 12 months including current

            // Build query with optional company filter
            var salesQuery = _context.Sales
                .Include(s => s.Company)
                .Where(s => s.CreatedOn >= startDate && s.Status == SaleStatus.COMPLETED);

            // Filter by company name if provided
            if (!string.IsNullOrWhiteSpace(query.CompanyName))
            {
                salesQuery = salesQuery.Where(s => s.Company.Name == query.CompanyName);
            }

            // Get actual sales data
            var salesData = await salesQuery
                .GroupBy(s => new { s.CreatedOn.Year, s.CreatedOn.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalSales = g.Sum(s => s.Total),
                    SaleCount = g.Count()
                })
                .ToListAsync();

            // Generate all 12 months
            var result = new List<MonthlySalesReportDto>();
            for (int i = 11; i >= 0; i--)
            {
                var date = endDate.AddMonths(-i);
                var existingData = salesData.FirstOrDefault(d => d.Year == date.Year && d.Month == date.Month);

                result.Add(new MonthlySalesReportDto
                {
                    Year = date.Year,
                    Month = date.Month,
                    MonthName = date.ToString("MMM yyyy"),
                    TotalSales = existingData?.TotalSales ?? 0,
                    SaleCount = existingData?.SaleCount ?? 0
                });
            }

            return Ok(ApiResponse<List<MonthlySalesReportDto>>.Ok(result));
        }

        [HttpGet("tax-due-last-12-months")]
        public async Task<ActionResult<ApiResponse<List<MonthlyTaxReportDto>>>> GetTaxDueLast12Months([FromQuery] RequestQueryObject query)
        {
            var endDate = DateTime.UtcNow;
            var startDate = endDate.AddMonths(-11).Date;

            // Build query with optional company filter
            var salesQuery = _context.Sales
                .Include(s => s.Company)
                .Where(s => s.CreatedOn >= startDate && s.Status == SaleStatus.COMPLETED);

            // Filter by company name if provided
            if (!string.IsNullOrWhiteSpace(query.CompanyName))
            {
                salesQuery = salesQuery.Where(s => s.Company.Name == query.CompanyName);
            }

            // Get actual tax data
            var taxData = await salesQuery
                .GroupBy(s => new { s.CreatedOn.Year, s.CreatedOn.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TaxDue = g.Sum(s => s.TaxTotal)
                })
                .ToListAsync();

            // Generate all 12 months
            var result = new List<MonthlyTaxReportDto>();
            for (int i = 11; i >= 0; i--)
            {
                var date = endDate.AddMonths(-i);
                var existingData = taxData.FirstOrDefault(d => d.Year == date.Year && d.Month == date.Month);

                result.Add(new MonthlyTaxReportDto
                {
                    Year = date.Year,
                    Month = date.Month,
                    MonthName = date.ToString("MMM yyyy"),
                    TaxDue = existingData?.TaxDue ?? 0
                });
            }

            return Ok(ApiResponse<List<MonthlyTaxReportDto>>.Ok(result));
        }
    }
}