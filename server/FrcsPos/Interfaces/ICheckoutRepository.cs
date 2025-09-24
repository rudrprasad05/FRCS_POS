using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface ICheckoutRepository
    {
        public Task<ApiResponse<SaleDTO>> CreateCheckoutAsync(NewCheckoutRequest request);
        public Task<ApiResponse<string>> GenerateReceiptPDF(string uuid);
        public Task<ApiResponse<SaleDTO>> GetByUUIDAsync(string uuid);
        public Task<ApiResponse<List<SaleDTO>>> GetSaleByCompanyAsync(RequestQueryObject queryObject);
        public Task<ApiResponse<SaleDTO>> GetReceiptAsync(string uuid);

    }
}