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
                CompanyId = request.CompanyId,
                PosSessionId = request.PosSessionId,
                CashierId = request.CashierId,
                InvoiceNumber = request.InvoiceNumber,
                Subtotal = request.Subtotal,
                TaxTotal = request.TaxTotal,
                Total = request.Total,
                Status = request.Status,
            };

            return dto;
        }
    }
}