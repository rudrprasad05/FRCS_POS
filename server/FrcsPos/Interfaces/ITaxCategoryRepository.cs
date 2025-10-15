using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface ITaxCategoryRepository
    {
        Task<ApiResponse<List<TaxCategoryDTO>>> GetAllTaxCategories(RequestQueryObject queryObject);
        Task<ApiResponse<TaxCategoryDTO>> GetOneAsync(RequestQueryObject queryObject);
        Task<ApiResponse<TaxCategoryDTO>> CreateTaxCategoryAsync(NewTaxRequest request);
        Task<ApiResponse<TaxCategoryDTO>> EditTaxAsync(NewTaxRequest request, RequestQueryObject queryObject);
        Task<ApiResponse<TaxCategoryDTO>> SoftDelete(string uuid);
        Task<ApiResponse<TaxCategoryDTO>> ActivateAsync(string uuid);
    }
}

