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
    [ApiController]
    [Route("api/refunds")]
    public class RefundsController : ControllerBase
    {
        private readonly IRefundService _refundService;

        public RefundsController(IRefundService refundService)
        {
            _refundService = refundService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] RequestQueryObject query)
        {
            var res = await _refundService.GetAllRefundsAsync(query);
            return StatusCode(res.StatusCode, res);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            var res = await _refundService.GetRefundByIdAsync(id);
            return StatusCode(res.StatusCode, res);
        }

        [HttpGet("get-by-uuid")]
        [Authorize]
        public async Task<IActionResult> GetByUUID([FromQuery] RequestQueryObject query)
        {
            var res = await _refundService.GetRefundByUUIDAsync(query);
            return StatusCode(res.StatusCode, res);
        }

        // POST api/refunds
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Start([FromBody] StartRefundRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
            var res = await _refundService.StartRefundAsync(request, userId);
            return StatusCode(res.StatusCode, res);
        }

        // POST api/refunds/{id}/approve
        [HttpPost("{id}/approve")]
        [Authorize]
        public async Task<IActionResult> Approve(int id, [FromBody] AdminApprovalRequest request)
        {
            var res = await _refundService.ApproveRefundAsync(id, request);
            return StatusCode(res.StatusCode, res);
        }
    }
}

