using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IReportService
    {
        Task<ApiResponse<SalesSummaryDTO>> GetDailySalesAsync(DateTime date);
        Task<ApiResponse<AnnualSalesDTO>> GetAnnualSalesAsync(int year);
        Task<ApiResponse<List<TopProductDTO>>> GetTopProductsAsync(int limit = 5);
        Task<ApiResponse<List<StockLevelDTO>>> GetStockLevelsAsync();
    }
}
