using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public static class SaleMapper
    {
        public static SaleDTO FromModelToDto(this Sale request)
        {
            if (request == null)
            {
                return new SaleDTO();
            }

            var dto = new SaleDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                UpdatedOn = request.UpdatedOn,
                CashierId = request.CashierId,
                CompanyId = request.CompanyId,
                PosSessionId = request.PosSessionId,

                InvoiceNumber = request.InvoiceNumber,
                Subtotal = request.Subtotal,
                TaxTotal = request.TaxTotal,
                Total = request.Total,
                Status = request.Status,
            };

            if (request.Cashier != null)
            {
                dto.Cashier = request.Cashier.FromUserToDto();
            }

            if (request.Company != null)
            {
                dto.Company = request.Company.FromModelToDto();
            }

            if (request.PosSession != null)
            {
                dto.PosSession = request.PosSession.FromModelToDTO(includeSale: false);
            }

            if (request.Items != null)
            {
                dto.Items = request.Items.FromModelToDto(includeSale: false);
            }

            return dto;
        }
        public static List<SaleDTO> FromModelToDto(this ICollection<Sale> request)
        {
            if (request == null || request.Count == 0)
            {
                return [];
            }
            List<SaleDTO> ptdList = [];
            foreach (Sale pt in request)
            {
                SaleDTO ptd = pt.FromModelToDto();
                ptdList.Add(ptd);
            }

            return ptdList;
        }
    }
}