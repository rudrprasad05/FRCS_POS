using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FrcsPos.DTO
{
    public class MediaDto
    {

        public string Url { get; set; } = string.Empty;
        public string UUID { get; set; } = string.Empty;
        public int Id { get; set; }
        public string ObjectKey { get; set; } = string.Empty;
        public string AltText { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long SizeInBytes { get; set; }
        public bool ShowInGallery { get; set; } = true;

    }
}