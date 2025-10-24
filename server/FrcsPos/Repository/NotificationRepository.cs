using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Response.DTO;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationMapper _notificationMapper;
        public NotificationRepository(
           ApplicationDbContext applicationDbContext,
           INotificationMapper notificationMapper
       )
        {
            _context = applicationDbContext;
            _notificationMapper = notificationMapper;
        }

        public async Task<ApiResponse<List<NotificationDTO>>> GetNotificationByCompany(RequestQueryObject queryObject)
        {
            var query = _context.Notifications
                .Include(x => x.User)
                    .ThenInclude(x => x.ProfilePicture)
                .Where(x => x.User != null)
                .AsQueryable();

            // filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrEmpty(queryObject.CompanyName))
            {
                query = query.Where(c => c.Company != null && c.Company.Name == queryObject.CompanyName);
            }

            query = query.Where(c => c.IsSuperAdmin == false);

            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var notifications = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<NotificationDTO>();
            foreach (var notification in notifications)
            {
                var dto = await _notificationMapper.FromModelToDto(notification);
                result.Add(dto);
            }

            return new ApiResponse<List<NotificationDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = queryObject.PageNumber,
                    PageSize = queryObject.PageSize
                }
            };
        }

        public async Task<ApiResponse<List<NotificationDTO>>> GetSuperAdminNotifications(RequestQueryObject queryObject)
        {
            var query = _context.Notifications.AsQueryable();

            // filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrEmpty(queryObject.CompanyName))
            {
                var company = await _context.Companies.FirstOrDefaultAsync(x => x.Name == queryObject.CompanyName);
                if (company == null)
                {
                    return ApiResponse<List<NotificationDTO>>.Fail(message: "invalid company name");
                }
                query = query.Where(c => c.CompanyId == company.Id);
            }
            else
            {
                query = query.Where(c => c.IsSuperAdmin == true);
            }

            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var notifications = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<NotificationDTO>();
            foreach (var notification in notifications)
            {
                var dto = await _notificationMapper.FromModelToDto(notification);
                result.Add(dto);
            }

            return new ApiResponse<List<NotificationDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = queryObject.PageNumber,
                    PageSize = queryObject.PageSize
                }
            };
        }

        public async Task<ApiResponse<NotificationDTO>> MarkReadAsync(RequestQueryObject queryObject)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(x => x.UUID == queryObject.UUID);
            if (notification == null)
            {
                return ApiResponse<NotificationDTO>.NotFound();
            }

            notification.IsRead = !notification.IsRead;

            await _context.SaveChangesAsync();

            return ApiResponse<NotificationDTO>.Ok(await _notificationMapper.FromModelToDto(notification));
        }

        public async Task<ApiResponse<List<NotificationDTO>>> GetAllAsync(RequestQueryObject queryObject)
        {
            var query = _context.Notifications.AsQueryable();

            // filtering
            if (queryObject.IsDeleted.HasValue)
            {
                query = query.Where(c => c.IsDeleted == queryObject.IsDeleted.Value);
            }

            if (!string.IsNullOrEmpty(queryObject.Role) && queryObject.Role.Equals("superadmin"))
            {
                query = query.Where(c => c.IsSuperAdmin == true);
            }
            else
            {
                query = query.Where(c => c.IsSuperAdmin == false);

                if (!string.IsNullOrEmpty(queryObject.CompanyName))
                {
                    query = query.Where(c => c.Company != null && c.Company.Name == queryObject.CompanyName);
                }
            }

            // Sorting
            query = queryObject.SortBy switch
            {
                ESortBy.ASC => query.OrderBy(c => c.CreatedOn),
                ESortBy.DSC => query.OrderByDescending(c => c.CreatedOn),
                _ => query.OrderByDescending(c => c.CreatedOn)
            };

            var totalCount = await query.CountAsync();

            // Pagination
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var notifications = await query
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();

            // Mapping to DTOs
            var result = new List<NotificationDTO>();
            foreach (var notification in notifications)
            {
                var dto = await _notificationMapper.FromModelToDto(notification); ;
                result.Add(dto);
            }

            return new ApiResponse<List<NotificationDTO>>
            {
                Success = true,
                StatusCode = 200,
                Data = result,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = queryObject.PageNumber,
                    PageSize = queryObject.PageSize
                }
            };
        }
    }
}