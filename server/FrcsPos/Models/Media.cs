using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Models;

namespace CrumbCodeBackend.Models
{
    public class Media : BaseModel
    {
        public string Url { get; set; } = string.Empty;
        public string ObjectKey { get; set; } = string.Empty;
        public string AltText { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long SizeInBytes { get; set; }
        public bool ShowInGallery { get; set; } = true;
    }

}