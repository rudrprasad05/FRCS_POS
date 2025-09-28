using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.AspNetCore.Mvc;
using FrcsPos.Interfaces;

namespace FrcsPos.Controllers
{
    [ApiController]
    [Route("api/warehouse")] // Use [controller] token for robustness
    public class WarehousesController : BaseController
    {
        private readonly IWarehouseService _warehouseService;

        public WarehousesController(
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<WarehousesController> logger,
            IWarehouseService warehouseService
        ) : base(configuration, tokenService, logger)
        {
            _warehouseService = warehouseService;
        }

        // GET: api/warehouses?companyId={companyId}
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<WarehouseDTO>>>> GetAll([FromQuery] int companyId)
        {
            var result = await _warehouseService.GetAllAsync(companyId);
            if (result == null)
            {
                return BadRequest("model not gotten");
            }

            return Ok(result);
            
        }

        // GET: api/warehouses/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<WarehouseDTO>>> GetById(int id)
        {
            var warehouse = await _warehouseService.GetByIdAsync(id);
            if (warehouse == null) return ApiResponse<WarehouseDTO>.NotFound();
            return Ok(warehouse);
        }

        // POST: api/warehouses
        [HttpPost("create")]
        public async Task<ActionResult<ApiResponse<WarehouseDTO>>> Create([FromBody] WarehouseRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                return BadRequest(errors);
            }

            var warehouse = await _warehouseService.CreateAsync(request);
            return Ok(warehouse);
        }

        // PUT: api/warehouses/{id}
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponse<WarehouseDTO>>> Update(int id, [FromBody] WarehouseRequest request)
        {
            var updatedWarehouse = await _warehouseService.UpdateAsync(id, request);
            if (updatedWarehouse == null) return ApiResponse<WarehouseDTO>.NotFound();
            return Ok(updatedWarehouse);
        }

        // DELETE: api/warehouses/{id}
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            var deleted = await _warehouseService.DeleteAsync(id);
            if (deleted != null) return NotFound();
            return Ok(deleted);
        }
    }   


}