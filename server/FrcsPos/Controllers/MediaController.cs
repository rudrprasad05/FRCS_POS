using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3;
using FrcsPos.DTO;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace FrcsPos.Controllers
{
    // Controller for media management
    [Authorize]
    [ApiController]
    [Route("api/media")]
    public class MediaController : BaseController
    {
        private readonly IMediaRepository _mediaRepository;

        // Constructor to inject dependencies
        public MediaController(IMediaRepository mediaRepository,
            IAmazonS3Service amazonS3Service,
            IConfiguration configuration,
            ILogger<MediaController> logger,
            ITokenService tokenService
        ) : base(configuration, tokenService, logger)
        {
            _mediaRepository = mediaRepository;
        }

        // Upsert media
        [HttpPost("upsert")]
        public async Task<IActionResult> UpsertAsync(
            [FromQuery] string? uuid,
            [FromForm] string AltText,
            [FromForm] string FileName,
            [FromForm] bool ShowInGallery,
            IFormFile? File)
        {

            var req = new Media
            {
                AltText = AltText,
                FileName = FileName,
                ShowInGallery = ShowInGallery,
            };

            if (File != null)
            {
                req.SizeInBytes = File.Length;
                req.ContentType = File.ContentType;
            }

            var exists = await _mediaRepository.Exists(uuid ?? "");
            var model = new ApiResponse<MediaDto>();

            if (exists != null && uuid != null) // update
            {
                model = await _mediaRepository.UpdateAsync(uuid, req, file: File);
            }
            else
            {
                model = await _mediaRepository.CreateAsync(req, file: File);
            }

            if (!model.Success)
            {
                return BadRequest(model);
            }

            return Ok(model);
        }

        // Get total storage sum
        [HttpGet("sum")]
        public async Task<IActionResult> Sum()
        {
            var req = await _mediaRepository.SumStorage();

            return Ok(req);
        }

        [HttpGet("get-all")]
        [ProducesResponseType(typeof(ApiResponse<MediaDto[]>), 200)]

        public async Task<IActionResult> GetAll([FromQuery] RequestQueryObject queryObject)
        {
            var media = await _mediaRepository.GetAll(queryObject);
            if (media == null)
            {
                return BadRequest(ApiResponse<string>.Fail(message: "fail"));
            }

            return Ok(media);
        }

        [HttpGet("get-one/{id}")]
        public async Task<IActionResult> GetOne([FromRoute] string id)
        {
            var media = await _mediaRepository.GetOne(id);
            if (media == null)
            {
                return Unauthorized();
            }

            return Ok(media);
        }

        [HttpDelete("safe-delete/{uuid}")]
        public override async Task<IActionResult> SafeDelete([FromRoute] string uuid)
        {
            var model = await _mediaRepository.SafeDelete(uuid);

            return StatusCode(model.StatusCode, model);
        }


    }
}