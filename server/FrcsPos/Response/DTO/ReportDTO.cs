using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.Response.DTO
{
    public record MonthlySalesReportDto(
        int Year,
        int Month,
        decimal TotalSales,
        int SaleCount);

    // Reports/Dtos/MonthlyTaxReportDto.cs
    public record MonthlyTaxReportDto(
        int Year,
        int Month,
        decimal TotalTax);
}
