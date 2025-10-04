using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using FrcsPos.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    [ApiController]
    [Route("api/blob")]
    public class BlobController : BaseController
    {
        private const string ContainerName = "myfiles";
        public const string SuccessMessageKey = "SuccessMessage";
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
        public async Task<IActionResult> Upload([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "No file provided." });

            try
            {
                // Generate unique file name if needed
                var fileName = $"frcs/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

                var blobClient = _containerClient.GetBlobClient(fileName);

                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, overwrite: true);
                }

                // Build blob URL
                var blobUrl = blobClient.Uri.ToString();

                return Ok(new { success = true, message = "File uploaded successfully.", url = blobUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error uploading file: {ex.Message}" });
            }
        }

    }
}