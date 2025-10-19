using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Mappers
{
    public interface IRefundMapper
    {
        Task<RefundDTO> FromModelToDtoAsync(RefundRequest request);
        RefundDTO FromModelToOnlyDto(RefundRequest request);
        Task<List<RefundDTO>> FromModelToDtoAsync(ICollection<RefundRequest> request);
    }
    public class RefundMapper : IRefundMapper
    {
        private readonly IRefundItemMapper _refundItemMapper;

        public RefundMapper(IRefundItemMapper refundItemMapper)
        {
            _refundItemMapper = refundItemMapper;
        }

        public async Task<RefundDTO> FromModelToDtoAsync(RefundRequest request)
        {
            if (request == null)
                return new RefundDTO();

            var dto = new RefundDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                CompanyId = request.CompanyId,
                Status = request.Status,
                Reason = request.Reason
            };

            // Map Variants (with signed media URLs)
            if (request.ApprovedBy != null)
            {
                dto.ApprovedBy = request.ApprovedBy.FromUserToDto();
            }

            if (request.RequestedBy != null)
            {
                dto.RequestedBy = request.RequestedBy.FromUserToDto();
            }

            // // Map Tax Category
            if (request.Items != null)
            {
                dto.Items = await _refundItemMapper.FromModelToDtoAsync(request.Items);
            }

            if (request.Sale != null)
            {
                dto.Sale = request.Sale.FromModelToDtoStatic();
            }

            return dto;
        }

        public RefundDTO FromModelToOnlyDto(RefundRequest request)
        {
            if (request == null)
                return new RefundDTO();

            return new RefundDTO
            {
                UUID = request.UUID,
                Id = request.Id,
                CreatedOn = request.CreatedOn,
                CompanyId = request.CompanyId,
            };
        }

        public async Task<List<RefundDTO>> FromModelToDtoAsync(ICollection<RefundRequest> request)
        {
            if (request == null || request.Count == 0)
                return [];

            var dtoList = new List<RefundDTO>();
            foreach (var product in request)
            {
                dtoList.Add(await FromModelToDtoAsync(product));
            }

            return dtoList;
        }
    }
}
