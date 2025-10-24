using System;
using System.Collections.Generic;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Interfaces
{
    public interface IRefundService
    {
        public Task<ApiResponse<RefundDTO>> StartRefundAsync(StartRefundRequest request, string cashierUserId);
        public Task<ApiResponse<RefundDTO>> GetRefundByIdAsync(int refundId);
        public Task<ApiResponse<RefundDTO>> GetRefundByUUIDAsync(RequestQueryObject query);
        public Task<ApiResponse<List<RefundDTO>>> GetAllRefundsAsync(RequestQueryObject query);
        public Task<ApiResponse<RefundDTO>> ApproveRefundAsync(RequestQueryObject query, AdminApprovalRequest request);
        public Task<ApiResponse<RefundDTO>> RejectRefundAsync(RequestQueryObject query, AdminApprovalRequest request);
    }
}
