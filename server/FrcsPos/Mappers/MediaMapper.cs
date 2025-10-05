using FrcsPos.DTO;
using FrcsPos.Interfaces;
using FrcsPos.Models;

namespace FrcsPos.Mappers
{
    public interface IMediaMapper
    {
        Task<MediaDto> ToDtoAsync(Media media);
    }

    public class MediaMapper : IMediaMapper
    {
        private readonly IAzureBlobService _azureBlobService;

        public MediaMapper(IAzureBlobService azureBlobService)
        {
            _azureBlobService = azureBlobService;
        }

        public async Task<MediaDto> ToDtoAsync(Media media)
        {
            var signedUrl = await _azureBlobService.GetImageSignedUrl(media.ObjectKey ?? "");
            return new MediaDto
            {
                Id = media.Id,
                AltText = media.AltText,
                FileName = media.FileName,
                ContentType = media.ContentType,
                SizeInBytes = media.SizeInBytes,
                UUID = media.UUID,
                Url = signedUrl ?? media.Url,
                ObjectKey = media.ObjectKey ?? "",
                ShowInGallery = media.ShowInGallery
            };
        }
    }

}

