using System.Security.Claims;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using FrcsPos.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FrcsPos.Response;
using FrcsPos.Response.DTO;

namespace FrcsPos.Controllers
{
    //Refund management controller
    [Authorize(Roles = "admin, cashier")]
    [ApiController]
    [Route("api/refunds")]
    public class RefundsController : ControllerBase
    {
        private readonly IRefundService _refundService;

        //Constructor to inject refund service
        public RefundsController(IRefundService refundService)
        {
            _refundService = refundService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] RequestQueryObject query)
        {
            var res = await _refundService.GetAllRefundsAsync(query);
            return StatusCode(res.StatusCode, res);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var res = await _refundService.GetRefundByIdAsync(id);
            return StatusCode(res.StatusCode, res);
        }

        [HttpGet("get-by-uuid")]
        public async Task<IActionResult> GetByUUID([FromQuery] RequestQueryObject query)
        {
            var res = await _refundService.GetRefundByUUIDAsync(query);
            return StatusCode(res.StatusCode, res);
        }

        // POST api/refunds
        // Start new refund
        [HttpPost]
        public async Task<IActionResult> Start([FromBody] StartRefundRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var res = await _refundService.StartRefundAsync(request, userId);
            return StatusCode(res.StatusCode, res);
        }

        // POST api/refunds/{id}/approve
        // Approve refund
        [HttpPost("approve")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Approve([FromQuery] RequestQueryObject query, [FromBody] AdminApprovalRequest request)
        {
            var res = await _refundService.ApproveRefundAsync(query, request);
            return StatusCode(res.StatusCode, res);
        }

        [HttpPost("reject")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Reject([FromQuery] RequestQueryObject query, [FromBody] AdminApprovalRequest request)
        {
            var res = await _refundService.RejectRefundAsync(query, request);
            return StatusCode(res.StatusCode, res);
        }
    }
}

