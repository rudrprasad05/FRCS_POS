using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.DTO;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using FrcsPos.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Repository
{
    public class MediaRepository : IMediaRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IAmazonS3Service _amazonS3Service;
        private readonly INotificationService _notificationService;

        public MediaRepository(INotificationService notificationService, ApplicationDbContext context, IAmazonS3Service amazonS3Service)
        {
            _context = context;
            _amazonS3Service = amazonS3Service;
            _notificationService = notificationService;

        }
        public async Task<ApiResponse<double>> SumStorage()
        {
            var sizes = await _context.Medias.Select(m => m.SizeInBytes).ToListAsync();
            var data = await _context.Medias.SumAsync(m => m.SizeInBytes);

            return new ApiResponse<double>
            {
                Success = true,
                StatusCode = 200,
                Message = "ok",
                Data = data
            };
        }

        public async Task<ApiResponse<MediaDto>> CreateAsync(Media media, IFormFile? file)
        {
            if (file == null || media == null) return ApiResponse<MediaDto>.Fail();

            using var transaction = await _context.Database.BeginTransactionAsync();
            var guid = Guid.NewGuid().ToString();
            try
            {
                var fileUrl = await _amazonS3Service.UploadFileAsync(file, guid);
                if (fileUrl == null) return ApiResponse<MediaDto>.NotFound();

                var newMedia = new Media
                {
                    AltText = media.AltText,
                    Url = fileUrl,
                    ObjectKey = "frcs/" + guid + "." + fileUrl.Split(".").Last(),
                    UUID = guid,
                    ContentType = media.ContentType,
                    FileName = media.FileName,
                    SizeInBytes = media.SizeInBytes,
                    ShowInGallery = media.ShowInGallery,
                };

                if (newMedia == null)
                {
                    return ApiResponse<MediaDto>.Fail();
                }

                await _context.Medias.AddAsync(newMedia);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                    title: "Media created",
                    message: "The media " + newMedia.FileName + " was created",
                    type: NotificationType.SUCCESS,
                    actionUrl: "/admin/media/edit/" + newMedia.UUID
                ));

                return new ApiResponse<MediaDto>
                {
                    Success = true,
                    StatusCode = 200,
                    Message = "ok",
                    Data = newMedia.FromModelToDTO()
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }

        }

        public async Task<ApiResponse<List<Media>>> GetAll(RequestQueryObject queryObject)
        {
            var media = _context.Medias.AsQueryable();
            if (queryObject.IsDeleted.HasValue)
            {
                media = media.Where(m => m.IsDeleted == queryObject.IsDeleted.Value);
            }

            var totalCount = await media.CountAsync();
            var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
            var res = await media
                .Skip(skip)
                .Take(queryObject.PageSize)
                .ToListAsync();
            var signedMedia = new List<Media>();

            foreach (var item in res)
            {
                var signedUrl = await _amazonS3Service.GetImageSignedUrl(item.ObjectKey);

                item.Url = signedUrl;
                signedMedia.Add(item);
            }

            return new ApiResponse<List<Media>>
            {
                Success = true,
                StatusCode = 200,
                Data = signedMedia,
                Meta = new MetaData
                {
                    TotalCount = totalCount,
                    PageNumber = queryObject.PageNumber,
                    PageSize = queryObject.PageSize
                }
            };

        }

        public async Task<ApiResponse<MediaDto>> UpdateAsync(string uuid, Media media, IFormFile? file)
        {
            var existingMedia = await _context.Medias.FirstOrDefaultAsync((m) => m.UUID == uuid);
            if (existingMedia == null)
            {
                return new ApiResponse<MediaDto>
                {
                    Success = false,
                    StatusCode = 400,
                    Message = "file was null"
                };
            }
            ;

            if (file != null)
            {
                var newMediaObjectKey = Guid.NewGuid().ToString();
                var fileUrl = await _amazonS3Service.UploadFileAsync(file, newMediaObjectKey);
                if (fileUrl == null)
                {
                    return new ApiResponse<MediaDto>
                    {
                        Success = false,
                        StatusCode = 400,
                        Message = "file url not provided"
                    };
                }

                existingMedia.Url = fileUrl;
                existingMedia.ObjectKey = "frcs/" + newMediaObjectKey + "." + fileUrl.Split(".").Last();
            }

            existingMedia.AltText = media.AltText;
            existingMedia.FileName = media.FileName;
            existingMedia.ShowInGallery = media.ShowInGallery;

            await _context.SaveChangesAsync();

            FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                title: "Media Updated",
                message: "The media " + existingMedia.FileName + " was updated",
                type: NotificationType.SUCCESS,
                actionUrl: "/admin/bin?type=media&uuid=" + existingMedia.UUID
            ));

            return new ApiResponse<MediaDto>
            {
                Success = true,
                StatusCode = 200,
                Message = "ok",
                Data = existingMedia.FromModelToDTO()
            };
        }
        public async Task<ApiResponse<MediaDto>> GetOne(string uuid)
        {
            var mediaQ = _context.Medias.AsQueryable();
            var media = await mediaQ.FirstOrDefaultAsync(m => m.UUID == uuid);

            if (media == null)
            {
                return new ApiResponse<MediaDto>
                {
                    Success = false,
                    StatusCode = 400,
                    Message = "file was null"
                };
            }

            var signedUrl = await _amazonS3Service.GetImageSignedUrl(media.ObjectKey);
            media.Url = signedUrl;

            return new ApiResponse<MediaDto>
            {
                Success = true,
                StatusCode = 200,
                Message = "ok",
                Data = media.FromModelToDTO()
            };
        }
        public async Task<ApiResponse<MediaDto>> SafeDelete(string uuid)
        {
            var media = await Exists(uuid);
            if (media == null)
            {
                return new ApiResponse<MediaDto>
                {
                    Success = false,
                    StatusCode = 400,
                    Message = "media was null"
                };
            }
            media.IsDeleted = true;

            await _context.SaveChangesAsync();
            FireAndForget.Run(_notificationService.CreateBackgroundNotification(
                title: "Media Deleted",
                message: "The media " + media.FileName + " was deleted",
                type: NotificationType.WARNING,
                actionUrl: "/admin/bin?type=media&uuid=" + media.UUID
            ));

            return new ApiResponse<MediaDto>
            {
                Success = true,
                StatusCode = 200,
                Data = media.FromModelToDTO()
            };
        }

        public async Task<Media?> Exists(string? uuid)
        {
            if (string.IsNullOrEmpty(uuid))
            {
                return null;
            }

            var media = await _context.Medias.FirstOrDefaultAsync(c => c.UUID == uuid);
            return media;
        }

    }
}