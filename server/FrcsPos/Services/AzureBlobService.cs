using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using FrcsPos.Interfaces;

namespace FrcsPos.Services
{
    public class AzureBlobService : IAzureBlobService
    {
        private const string ContainerName = "storage";
        private const string AccountName = "frcs";
        private const string AccountKey = "Uff8GgMP6tFgqEK8Cql/U4ZuSWyUGUti9nuov3Aisl4ez3fGb8r3srOXUzm0DUEqKcCvLPCMpLeg+AStY3udSw==";

        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobContainerClient _containerClient;

        public AzureBlobService(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient ?? throw new ArgumentNullException(nameof(blobServiceClient));
            _containerClient = _blobServiceClient.GetBlobContainerClient(ContainerName);
            _containerClient.CreateIfNotExists();
        }

        public async Task<string> GetImageSignedUrl(string key)
        {
            var blobClient = _containerClient.GetBlobClient(key);
            if (!await blobClient.ExistsAsync())
                return string.Empty;

            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _containerClient.Name,
                BlobName = key,
                ExpiresOn = DateTimeOffset.UtcNow.AddHours(8),
                Resource = "b"
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            var sasToken = sasBuilder.ToSasQueryParameters(
                new StorageSharedKeyCredential(AccountName, AccountKey)
            ).ToString();

            return $"{blobClient.Uri}?{sasToken}";
        }

        public async Task<BlobDownloadInfo?> GetObjectAsync(string objKey)
        {
            try
            {
                var blobClient = _containerClient.GetBlobClient(objKey);
                if (await blobClient.ExistsAsync())
                {
                    var response = await blobClient.DownloadAsync();
                    return response.Value;
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Azure Blob Error: {ex.Message}");
                return null;
            }
        }

        public async Task<string?> UploadFileAsync(IFormFile file, string guid)
        {
            if (file == null || file.Length == 0)
                return null;

            try
            {
                var fileName = $"frcs/{guid}{Path.GetExtension(file.FileName)}";
                var blobClient = _containerClient.GetBlobClient(fileName);

                var headers = new BlobHttpHeaders
                {
                    ContentType = file.ContentType,
                    ContentDisposition = "inline"
                };

                using (var stream = file.OpenReadStream())
                {
                    var options = new BlobUploadOptions
                    {
                        HttpHeaders = headers
                    };
                    await blobClient.UploadAsync(stream, options);
                }

                return fileName;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading file: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> DeleteFileAsync(string fileName)
        {
            try
            {
                var blobClient = _containerClient.GetBlobClient($"frcs/{fileName}");
                var response = await blobClient.DeleteIfExistsAsync();
                return response.Value;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting file: {ex.Message}");
                return false;
            }
        }
    }
}
