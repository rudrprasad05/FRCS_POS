using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using FrcsPos.Interfaces;
using Microsoft.AspNetCore.Http;

namespace FrcsPos.Services
{
    public class AzureBlobService : IAzureBlobService
    {
        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobContainerClient _containerClient;
        private readonly string _containerName;
        private readonly string _serviceUrl;
        private readonly string _accountName;
        private readonly string _accountKey;

        public AzureBlobService(IConfiguration configuration)
        {
            var azureOptions = configuration.GetSection("AZURE_BLOB");

            var connectionString = azureOptions["ConnectionString"]
                ?? throw new InvalidOperationException("Missing ConnectionString");
            _containerName = azureOptions["ContainerName"]
                ?? throw new InvalidOperationException("Missing ContainerName");

            _blobServiceClient = new BlobServiceClient(connectionString);
            _containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);

            // Parse account key from connection string for SAS
            var parsed = ParseConnectionString(connectionString);
            _accountName = parsed.AccountName ?? throw new InvalidOperationException("Missing AccountName");
            _accountKey = parsed.AccountKey ?? throw new InvalidOperationException("Missing AccountKey");
            _serviceUrl = _blobServiceClient.Uri.ToString().TrimEnd('/');


            _containerClient.CreateIfNotExists(PublicAccessType.None);
        }

        private static (string? AccountName, string? AccountKey) ParseConnectionString(string connectionString)
        {
            var pairs = connectionString.Split(';', StringSplitOptions.RemoveEmptyEntries);
            string? accountName = null, accountKey = null;

            foreach (var p in pairs)
            {
                var idx = p.IndexOf('=');
                if (idx <= 0) continue;
                var key = p.Substring(0, idx).Trim();
                var val = p.Substring(idx + 1).Trim();

                if (key.Equals("AccountName", StringComparison.OrdinalIgnoreCase))
                    accountName = val;
                else if (key.Equals("AccountKey", StringComparison.OrdinalIgnoreCase))
                    accountKey = val;
            }

            return (accountName, accountKey);
        }

        public async Task<string> GetImageSignedUrl(string key)
        {
            var blobClient = _containerClient.GetBlobClient(key);

            if (!await blobClient.ExistsAsync())
                return string.Empty;

            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = _containerName,
                BlobName = key,
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(15),
                Resource = "b" // "b" for blob
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            var sasToken = sasBuilder.ToSasQueryParameters(new StorageSharedKeyCredential(_accountName, _accountKey)).ToString();
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
            if (file.Length > 0)
            {
                try
                {
                    var fileName = "frcs/" + guid + Path.GetExtension(file.FileName);
                    var blobClient = _containerClient.GetBlobClient(fileName);

                    using (var stream = file.OpenReadStream())
                    {
                        await blobClient.UploadAsync(stream, overwrite: true);
                    }

                    return $"{_serviceUrl}/{_containerName}/{fileName}";
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error uploading file: {ex.Message}");
                    return "";
                }
            }

            return null;
        }

        public async Task<bool> DeleteFileAsync(string fileName)
        {
            try
            {
                var blobClient = _containerClient.GetBlobClient("frcs/" + fileName);
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
