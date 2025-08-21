using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class TaxMapper
    {
        public static TaxCategoryDTO FromModelToDto(this TaxCategory request)
        {
            if (request == null)
            {
                return new TaxCategoryDTO();
            }

            var dto = new TaxCategoryDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                Name = request.Name,
                RatePercent = request.RatePercent,
            };

            return dto;
        }

        public static List<TaxCategoryDTO> FromModelToDto(this ICollection<TaxCategory> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }

            var dtoList = new List<TaxCategoryDTO>();
            foreach (TaxCategory w in request)
            {
                var dto = w.FromModelToDto();
                dtoList.Add(dto);
            }

            return dtoList;
        }
    }
}