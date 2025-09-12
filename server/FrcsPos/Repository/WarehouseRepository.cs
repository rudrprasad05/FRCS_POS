using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using FrcsPos.Services;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class WarehouseRepository : IWarehouseRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IMediaRepository _mediaRepository;
        private readonly IUserContext _userContext;

        public WarehouseRepository(
           ApplicationDbContext applicationDbContext,
           INotificationService notificationService,
           IMediaRepository mediaRepository,
            IUserContext userContext
        )
        {
            _context = applicationDbContext;
            _notificationService = notificationService;
            _mediaRepository = mediaRepository;
            _userContext = userContext;
        }

        public async Task<ApiResponse<WarehouseDTO>> CreateAsync(NewWarehouseRequest request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Name == request.CompanyName);
            if (company == null)
            {
                return ApiResponse<WarehouseDTO>.Fail(message: "company not found");
            }

            var dto = request.FromReqToDTO();
            dto.CompanyId = company.Id;

            var model = dto.FromDTOToModel();
            var result = await _context.Warehouses.AddAsync(model);
            await _context.SaveChangesAsync();

            var finalModel = result.Entity.FromModelToDto();

            var userNotification = new NotificationDTO
            {
                Title = "New warehouse",
                Message = "A new warehouse was created",
                Type = NotificationType.SUCCESS,
                ActionUrl = $"/{company.Name}/warehouse/${model.UUID}/view",
                IsSuperAdmin = false,
                CompanyId = company.Id,
                UserId = _userContext.UserId
            };

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(userNotification));

            return ApiResponse<WarehouseDTO>.Ok(model.FromModelToDto());
        }

        public async Task<ApiResponse<WarehouseDTO>> EditAsync(EditWarehouseData request, RequestQueryObject queryObject)
        {
            var wh = await _context.Warehouses.FirstOrDefaultAsync(w => w.UUID == queryObject.UUID);
            if (wh == null)
            {
                return ApiResponse<WarehouseDTO>.Fail(message: "warehouse not found");
            }

            wh.Location = request.Location;
            wh.Name = request.Name;
            wh.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var whDTO = wh.FromModelToDto();
            return ApiResponse<WarehouseDTO>.Ok(whDTO);
        }

        public async Task<ApiResponse<List<WarehouseDTO>>> GetAllAsync(RequestQueryObject requestQueryObject)
        {
            if (string.IsNullOrWhiteSpace(requestQueryObject.CompanyName))
            {
                return ApiResponse<List<WarehouseDTO>>.Fail();
            }
            var query = _context.Warehouses
                .Include(p => p.ProductBatches)
                .Where(p => p.Company.Name == requestQueryObject.CompanyName)
                .AsQueryable();

            // filtering
            if (requestQueryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsActive != requestQueryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrWhiteSpace(requestQueryObject.Search))
            {
                var search = requestQueryObject.Search.ToLower();
                query = query.Where(c =>
                    c.Name.ToLower().Contains(search) ||
                    c.Location.ToLower().Contains(search)
                );
            }

            // Sorting
            query = requestQueryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (requestQueryObject.PageNumber - 1) * requestQueryObject.PageSize;
            var warehouses = await query
                .Skip(skip)
                .Take(requestQueryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<WarehouseDTO>();
            foreach (var warehouse in warehouses)
            {
                var dto = warehouse.FromModelToDto();
                result.Add(dto);
            }

            return new ApiResponse<List<WarehouseDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = requestQueryObject.PageNumber,
                    PageSize = requestQueryObject.PageSize
                }
            };
        }

        public async Task<ApiResponse<WarehouseDTO>> GetOneAsync(RequestQueryObject requestQueryObject)
        {
            if (string.IsNullOrEmpty(requestQueryObject.UUID))
            {
                return ApiResponse<WarehouseDTO>.Fail(message: "invalid url");
            }

            var wh = await _context.Warehouses
                .Include(wh => wh.ProductBatches)
                .FirstOrDefaultAsync(wh => wh.UUID == requestQueryObject.UUID);

            if (wh == null)
            {
                return ApiResponse<WarehouseDTO>.NotFound(message: "warehouse not found");
            }

            var dto = wh.FromModelToDto();

            return ApiResponse<WarehouseDTO>.Ok(dto);
        }

        public async Task<ApiResponse<WarehouseDTO>> SoftDeleteAsync(RequestQueryObject queryObject)
        {
            var wh = await _context.Warehouses.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (wh == null)
            {
                return ApiResponse<WarehouseDTO>.NotFound();
            }

            wh.IsDeleted = true;
            wh.IsActive = false;
            wh.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var warehouseDTO = wh.FromModelToDto();

            return ApiResponse<WarehouseDTO>.Ok(warehouseDTO);
        }

        public async Task<ApiResponse<WarehouseDTO>> Activate(RequestQueryObject queryObject)
        {
            var wh = await _context.Warehouses.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (wh == null)
            {
                return ApiResponse<WarehouseDTO>.NotFound();
            }

            wh.IsDeleted = false;
            wh.IsActive = true;
            wh.UpdatedOn = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            var warehouseDTO = wh.FromModelToDto();

            return ApiResponse<WarehouseDTO>.Ok(warehouseDTO);
        }
    }
}