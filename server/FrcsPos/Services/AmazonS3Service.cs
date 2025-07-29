using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Interfaces;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Amazon;

namespace FrcsPos.Services
{
    public class AmazonS3Service : IAmazonS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly string _serviceUrl;

        public AmazonS3Service(IConfiguration configuration)
        {
            // Initialize the S3 client
            var awsOptions = configuration.GetSection("MINIO");
            var accessKey = awsOptions["AccessKey"];
            var secretKey = awsOptions["SecretKey"];
            var region = RegionEndpoint.GetBySystemName(awsOptions["Region"]);
            _serviceUrl = awsOptions["ServiceURL"] ?? throw new InvalidOperationException("service URl");

            var config = new AmazonS3Config
            {
                RegionEndpoint = region,
                ServiceURL = _serviceUrl,
                ForcePathStyle = true // Important for MinIO
            };

            _s3Client = new AmazonS3Client(accessKey, secretKey, config);
            _bucketName = awsOptions["BucketName"] ?? throw new InvalidOperationException("bucket name");
        }

        public async Task<string> GetImageSignedUrl(string key)
        {
            var url = await _s3Client.GetPreSignedURLAsync(new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = key,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });

            return url;               
        }

        public async Task<GetObjectResponse?> GetObjectAsync(string objKey)
        {
            try
            {
                var request = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = objKey
                };

                var response = await _s3Client.GetObjectAsync(request);
                return response;
            }
            catch (AmazonS3Exception ex)
            {
                Console.WriteLine($"S3 Error: {ex.Message}");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"General Error: {ex.Message}");
                return null;
            }
        }
        public async Task<string?> UploadFileAsync(IFormFile file, string guid)
        {
            if (file.Length > 0)
            {
                try
                {
                    // Generate a unique file name for the file
                    var fileName = "crumbcode/" + guid + Path.GetExtension(file.FileName);

                    // Create a new TransferUtility instance to upload the file
                    using (var newMemoryStream = new MemoryStream())
                    {
                        await file.CopyToAsync(newMemoryStream);
                        var fileTransferUtility = new TransferUtility(_s3Client);

                        // Upload the file to S3
                        await fileTransferUtility.UploadAsync(newMemoryStream, _bucketName, fileName);

                        // Return the file URL
                        return $"{_serviceUrl}/{_bucketName}/{fileName}";
                    }
                }
                catch (AmazonS3Exception e)
                {
                    // Handle S3 exceptions here
                    throw new Exception($"Error uploading file: {e.Message}", e);
                }
            }

            return null;
        }

        public async Task<bool> DeleteFileAsync(string fileName)
        {
            try
            {
                // Construct the delete request
                var request = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = "crumbcode/" + fileName
                };

                // Delete the object from S3
                var response = await _s3Client.DeleteObjectAsync(request);

                // Return true if the deletion was successful
                return response.HttpStatusCode == System.Net.HttpStatusCode.NoContent;
            }
            catch (AmazonS3Exception ex)
            {
                // Handle S3 exceptions
                Console.WriteLine($"S3 Error: {ex.Message}");
                return false;
            }
            catch (Exception ex)
            {
                // Handle general errors
                Console.WriteLine($"General Error: {ex.Message}");
                return false;
            }
        }
    }
}