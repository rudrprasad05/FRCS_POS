using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public interface ISaleItemMapper
    {
        Task<SaleItemDTO> FromModelToDtoAsync(SaleItem request, bool includeSale = true);
        Task<List<SaleItemDTO>> FromModelToDtoAsync(ICollection<SaleItem> request, bool includeSale = true);
    }

    public class SaleItemMapper : ISaleItemMapper
    {
        private readonly IProductVariantMapper _productVariantMapper;
        private readonly IProductMapper _productMapper;

        public SaleItemMapper(IProductVariantMapper productVariantMapper, IProductMapper productMapper)
        {
            _productVariantMapper = productVariantMapper;
            _productMapper = productMapper;
        }

        public async Task<SaleItemDTO> FromModelToDtoAsync(SaleItem request, bool includeSale = true)
        {
            if (request == null)
                return new SaleItemDTO();

            var dto = new SaleItemDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Quantity = request.Quantity,
                UnitPrice = request.UnitPrice,
                TaxRatePercent = request.TaxRatePercent,
                LineTotal = request.LineTotal,
            };

            if (request.ProductVariant != null)
            {

                dto.ProductVariant = await _productVariantMapper.FromModelToDtoAsync(request.ProductVariant);
            }

            if (includeSale && request.Sale != null)
            {
                // dto.Sale = _sale.FromModelToOnlyDto(request.Sale);
            }

            return dto;
        }

        public async Task<List<SaleItemDTO>> FromModelToDtoAsync(ICollection<SaleItem> request, bool includeSale = true)
        {
            if (request == null || request.Count == 0)
                return new List<SaleItemDTO>();

            var list = new List<SaleItemDTO>();
            foreach (var item in request)
            {
                var dto = await FromModelToDtoAsync(item, includeSale);
                list.Add(dto);
            }

            return list;
        }
    }
}
