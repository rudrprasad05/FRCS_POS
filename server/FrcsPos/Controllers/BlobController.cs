using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using FrcsPos.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [ApiController]
    [Route("api/blob")]
    public class BlobController : BaseController
    {
        private const string ContainerName = "storage";
        public const string SuccessMessageKey = "SuccessMessage";
        private const string AccountName = "frcs";
        public const string AccountKey = "Uff8GgMP6tFgqEK8Cql/U4ZuSWyUGUti9nuov3Aisl4ez3fGb8r3srOXUzm0DUEqKcCvLPCMpLeg+AStY3udSw==";
        public const string ErrorMessageKey = "ErrorMessage";
        private readonly BlobServiceClient _blobServiceClient;
        private readonly BlobContainerClient _containerClient;

        public BlobController(
            BlobServiceClient blobServiceClient,
            IConfiguration configuration,
            ITokenService tokenService,
            ILogger<BlobController> logger)
        : base(configuration, tokenService, logger)
        {
            _blobServiceClient = blobServiceClient;
            _containerClient = _blobServiceClient.GetBlobContainerClient(ContainerName);
            _containerClient.CreateIfNotExists();
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] string AltText, [FromForm] IFormFile? file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "No file provided." });

            try
            {
                var fileName = $"frcs/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var blobClient = _containerClient.GetBlobClient(fileName);
                var headers = new BlobHttpHeaders
                {
                    ContentType = file.ContentType,
                    ContentDisposition = "inline"
                };


                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, headers);
                }

                var sasBuilder = new BlobSasBuilder
                {
                    BlobContainerName = _containerClient.Name,
                    BlobName = fileName,
                    ExpiresOn = DateTimeOffset.UtcNow.AddHours(8),
                    Resource = "b"
                };
                sasBuilder.SetPermissions(BlobSasPermissions.Read);

                var sasToken = sasBuilder.ToSasQueryParameters(
                    new StorageSharedKeyCredential(AccountName, AccountKey)
                ).ToString();

                var secureUrl = $"{blobClient.Uri}?{sasToken}";

                return Ok(new
                {
                    success = true,
                    message = "File uploaded successfully.",
                    url = secureUrl,
                    altText = AltText
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error uploading file: {ex.Message}" });
            }
        }


    }
}