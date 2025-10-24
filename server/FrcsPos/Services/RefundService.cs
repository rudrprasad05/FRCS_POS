using System.Collections.Generic;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Services
{
    public class RefundService : IRefundService
    {
        private readonly IRefundRepository _repo;

        public RefundService(IRefundRepository repo)
        {
            _repo = repo;
        }

        public Task<ApiResponse<RefundDTO>> StartRefundAsync(StartRefundRequest request, string cashierUserId)
        {
            return _repo.StartRefundAsync(request, cashierUserId);
        }

        public Task<ApiResponse<RefundDTO>> GetRefundByIdAsync(int refundId)
        {
            return _repo.GetRefundByIdAsync(refundId);
        }

        public Task<ApiResponse<List<RefundDTO>>> GetAllRefundsAsync(RequestQueryObject query)
        {
            return _repo.GetAllRefundsAsync(query);
        }

        public Task<ApiResponse<RefundDTO>> ApproveRefundAsync(RequestQueryObject query, AdminApprovalRequest request)
        {
            return _repo.ApproveRefundAsync(query, request);
        }

        public Task<ApiResponse<RefundDTO>> GetRefundByUUIDAsync(RequestQueryObject query)
        {
            return _repo.GetRefundByUUIDAsync(query);
        }

        public Task<ApiResponse<RefundDTO>> RejectRefundAsync(RequestQueryObject query, AdminApprovalRequest request)
        {
            return _repo.RejectRefundAsync(query, request);
        }
    }
}
