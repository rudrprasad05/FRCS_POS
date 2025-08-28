using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.DTO;
using FrcsPos.Models;

namespace FrcsPos.Mappers
{
    public static class MediaMapper
    {


        public static MediaDto FromModelToDTO(this Media? request, string? url = null)
        {
            if (request == null)
            {
                return new MediaDto();
            }

            return new MediaDto
            {
                Id = request.Id,
                AltText = request.AltText,
                FileName = request.FileName,
                ContentType = request.ContentType,
                SizeInBytes = request.SizeInBytes,
                UUID = request.UUID,
                Url = url ?? request.Url,
                ShowInGallery = request.ShowInGallery
            };

        }
    }
}