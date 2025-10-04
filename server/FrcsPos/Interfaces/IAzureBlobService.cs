using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs.Models;

namespace FrcsPos.Interfaces
{
    public interface IAzureBlobService
    {
        Task<string> GetImageSignedUrl(string key);
        Task<BlobDownloadInfo?> GetObjectAsync(string objKey);
        Task<string?> UploadFileAsync(IFormFile file, string guid);
        Task<bool> DeleteFileAsync(string fileName);
    }
}