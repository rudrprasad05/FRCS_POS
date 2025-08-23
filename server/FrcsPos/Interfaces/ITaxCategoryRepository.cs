using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface ITaxCategoryRepository
    {
        public Task<ApiResponse<List<TaxCategoryDTO>>> GetAllTaxCategories(RequestQueryObject queryObject);

    }
}