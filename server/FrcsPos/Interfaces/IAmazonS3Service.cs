using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;

namespace FrcsPos.Interfaces
{
    public interface IAmazonS3Service
    {
        Task<string?> UploadFileAsync(IFormFile file, string guid);
        public Task<GetObjectResponse?> GetObjectAsync(string objKey);
        public Task<bool> DeleteFileAsync(string fileName);
        public Task<string> GetImageSignedUrl(string key);
        
    }
}