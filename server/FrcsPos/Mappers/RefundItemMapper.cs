using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public interface IRefundItemMapper
    {
        Task<RefundItemDTO> FromModelToDtoAsync(RefundItem request);
        RefundItemDTO FromModelToOnlyDto(RefundItem request);
        Task<List<RefundItemDTO>> FromModelToDtoAsync(ICollection<RefundItem> request);
    }
    public class RefundItemMapper : IRefundItemMapper
    {
        private readonly ISaleItemMapper _saleItemMapper;
        public RefundItemMapper(ISaleItemMapper saleItemMapper)
        {
            _saleItemMapper = saleItemMapper;
        }

        public async Task<RefundItemDTO> FromModelToDtoAsync(RefundItem request)
        {
            if (request == null)
                return new RefundItemDTO();

            var dto = new RefundItemDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                Quantity = request.Quantity,
                ApprovedQuantity = request.ApprovedQuantity,
                Note = request.Note,
            };

            if (request.SaleItem != null)
            {
                dto.SaleItem = await _saleItemMapper.FromModelToDtoAsync(request.SaleItem);
            }

            return dto;
        }

        public RefundItemDTO FromModelToOnlyDto(RefundItem request)
        {
            if (request == null)
                return new RefundItemDTO();

            return new RefundItemDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
            };
        }

        public async Task<List<RefundItemDTO>> FromModelToDtoAsync(ICollection<RefundItem> request)
        {
            if (request == null || request.Count == 0)
                return [];

            var dtoList = new List<RefundItemDTO>();
            foreach (var product in request)
            {
                dtoList.Add(await FromModelToDtoAsync(product));
            }

            return dtoList;
        }
    }
}
