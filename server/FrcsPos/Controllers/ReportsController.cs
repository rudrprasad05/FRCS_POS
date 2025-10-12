using Microsoft.AspNetCore.Mvc;
using FrcsPos.Interfaces;

namespace FrcsPos.Controllers
{
    [ApiController]
    [Route("api/report")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("daily-sales")]
        public async Task<IActionResult> GetDailySales([FromQuery] DateTime date)
        {
            var result = await _reportService.GetDailySalesAsync(date);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("annual-sales")]
        public async Task<IActionResult> GetAnnualSales([FromQuery] int year)
        {
            var result = await _reportService.GetAnnualSalesAsync(year);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts([FromQuery] int limit = 5)
        {
            var result = await _reportService.GetTopProductsAsync(limit);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("stock-levels")]
        public async Task<IActionResult> GetStockLevels()
        {
            var result = await _reportService.GetStockLevelsAsync();
            return StatusCode(result.StatusCode, result);
        }
    }
}
