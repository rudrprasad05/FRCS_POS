using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public interface ISaleMapper
    {
        Task<SaleDTO> FromModelToDtoAsync(Sale request);
        Task<List<SaleDTO>> FromModelToDtoAsync(ICollection<Sale> request);
    }

    public class SaleMapper : ISaleMapper
    {
        private readonly ISaleItemMapper _saleItemMapper;

        public SaleMapper(ISaleItemMapper saleItemMapper)
        {
            _saleItemMapper = saleItemMapper ?? throw new ArgumentNullException(nameof(saleItemMapper));
        }

        public async Task<SaleDTO> FromModelToDtoAsync(Sale request)
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
                dto.Items = await _saleItemMapper.FromModelToDtoAsync(request.Items, includeSale: false);
            }

            return dto;
        }

        public async Task<List<SaleDTO>> FromModelToDtoAsync(ICollection<Sale> request)
        {
            if (request == null || request.Count == 0)
            {
                return new List<SaleDTO>();
            }

            var dtoList = new List<SaleDTO>();
            foreach (var sale in request)
            {
                var dto = await FromModelToDtoAsync(sale);
                dtoList.Add(dto);
            }

            return dtoList;
        }
    }
}