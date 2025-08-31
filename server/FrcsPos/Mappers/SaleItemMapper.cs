using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class SaleItemMapper
    {

        public static SaleItemDTO FromModelToDto(this SaleItem request, bool includeSale = true)
        {
            if (request == null)
            {
                return new SaleItemDTO();
            }

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

            if (request.Product != null)
            {
                dto.Product = request.Product.FromModelToDto();
            }

            if (includeSale && request.Sale != null)
            {
                dto.Sale = request.Sale.FromModelToDto();
            }


            return dto;
        }

        public static List<SaleItemDTO> FromModelToDto(this ICollection<SaleItem> request, bool includeSale = true)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }
            List<SaleItemDTO> ptdList = [];
            foreach (SaleItem pt in request)
            {
                SaleItemDTO ptd = pt.FromModelToDto(includeSale);
                ptdList.Add(ptd);
            }

            return ptdList;
        }
    }
}