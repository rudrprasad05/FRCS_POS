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
    public class SupplierRepository : ISupplierRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;
        private readonly IMediaRepository _mediaRepository;
        private readonly IUserContext _userContext;

        public SupplierRepository(
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

        public async Task<ApiResponse<SupplierDTO>> CreateAsync(NewSupplierRequest request)
        {
            var company = await _context.Companies.FirstOrDefaultAsync(c => c.Name == request.CompanyName);
            if (company == null)
            {
                return ApiResponse<SupplierDTO>.Fail(message: "company not found");
            }

            var model = request.FromReqToDTO().FromDTOToModel();
            model.CompanyId = company.Id;

            var result = await _context.Suppliers.AddAsync(model);
            await _context.SaveChangesAsync();

            var finalModel = result.Entity.FromModelToDto();

            var userNotification = new NotificationDTO
            {
                Title = "New Supplier",
                Message = "A new supplier was added",
                Type = NotificationType.SUCCESS,
                ActionUrl = $"/{company.Name}/suppliers/${model.UUID}/view",
                IsSuperAdmin = false,
                CompanyId = company.Id,
                UserId = _userContext.UserId
            };

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(userNotification));

            return ApiResponse<SupplierDTO>.Ok(finalModel);
        }

        public async Task<ApiResponse<SupplierDTO>> EditAsync(EditSupplierData request, RequestQueryObject queryObject)
        {
            var supplier = await _context.Suppliers.FirstOrDefaultAsync(w => w.UUID == queryObject.UUID);
            if (supplier == null)
            {
                return ApiResponse<SupplierDTO>.Fail(message: "supplier not found");
            }

            supplier.Name = request.Name;
            supplier.Code = request.Code;
            supplier.ContactName = request.ContactName;
            supplier.Phone = request.Phone;
            supplier.Email = request.Email;
            supplier.Address = request.Address;
            supplier.TaxNumber = request.TaxNumber;

            await _context.SaveChangesAsync();

            var supplierDTO = supplier.FromModelToDto();
            return ApiResponse<SupplierDTO>.Ok(supplierDTO);
        }

        public async Task<ApiResponse<List<SupplierDTO>>> GetAllAsync(RequestQueryObject requestQueryObject)
        {
            if (string.IsNullOrWhiteSpace(requestQueryObject.CompanyName))
            {
                return ApiResponse<List<SupplierDTO>>.Fail();
            }
            var query = _context.Suppliers
                .Include(s => s.Products)
                .Where(s => s.Company.Name == requestQueryObject.CompanyName)
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
                    c.TaxNumber.ToLower().Contains(search) ||
                    c.Code.ToLower().Contains(search) ||
                    c.Phone.ToLower().Contains(search) ||
                    c.Email.ToLower().Contains(search) ||
                    c.Address.ToLower().Contains(search)
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
            var result = new List<SupplierDTO>();
            foreach (var warehouse in warehouses)
            {
                var dto = warehouse.FromModelToDto();
                result.Add(dto);
            }

            return new ApiResponse<List<SupplierDTO>>
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

        public async Task<ApiResponse<SupplierDTO>> GetOneAsync(RequestQueryObject requestQueryObject)
        {
            if (string.IsNullOrEmpty(requestQueryObject.UUID))
            {
                return ApiResponse<SupplierDTO>.Fail(message: "invalid url");
            }

            var wh = await _context.Suppliers
                .Include(wh => wh.Batches)
                .FirstOrDefaultAsync(wh => wh.UUID == requestQueryObject.UUID);

            if (wh == null)
            {
                return ApiResponse<SupplierDTO>.NotFound(message: "warehouse not found");
            }

            var dto = wh.FromModelToDto();

            return ApiResponse<SupplierDTO>.Ok(dto);
        }

        public async Task<ApiResponse<SupplierDTO>> SoftDeleteAsync(RequestQueryObject queryObject)
        {
            var wh = await _context.Suppliers.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (wh == null)
            {
                return ApiResponse<SupplierDTO>.NotFound();
            }

            wh.IsDeleted = true;
            wh.IsActive = false;
            wh.UpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var dto = wh.FromModelToDto();

            return ApiResponse<SupplierDTO>.Ok(dto);
        }

        public async Task<ApiResponse<SupplierDTO>> Activate(RequestQueryObject queryObject)
        {
            var wh = await _context.Suppliers.FirstOrDefaultAsync(p => p.UUID == queryObject.UUID);
            if (wh == null)
            {
                return ApiResponse<SupplierDTO>.NotFound();
            }

            wh.IsDeleted = false;
            wh.IsActive = true;
            wh.UpdatedOn = DateTime.UtcNow;


            await _context.SaveChangesAsync();

            var dto = wh.FromModelToDto();

            return ApiResponse<SupplierDTO>.Ok(dto);
        }
    }
}