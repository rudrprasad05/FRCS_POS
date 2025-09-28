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
    public interface IRefundRepository
    {
        public Task<ApiResponse<RefundDTO>> StartRefundAsync(StartRefundRequest request, string cashierUserId);
        public Task<ApiResponse<RefundDTO>> GetRefundByIdAsync(int refundId);
        public Task<ApiResponse<List<RefundDTO>>> GetAllRefundsAsync(RequestQueryObject query);
        public Task<ApiResponse<RefundDTO>> ApproveRefundAsync(int refundId, AdminApprovalRequest request);
    }
}
