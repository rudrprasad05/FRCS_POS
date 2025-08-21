using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.DTO;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Response;


namespace FrcsPos.Interfaces
{
    public interface IMediaRepository
    {
        public Task<ApiResponse<MediaDto>> UpdateAsync(string uuid, Media media, IFormFile? file);
        public Task<ApiResponse<MediaDto>> CreateAsync(Media media, IFormFile? file);
        public Task<ApiResponse<MediaDto>> GetOne(string uuid);
        public Task<ApiResponse<List<Media>>> GetAll(RequestQueryObject queryObject);
        public Task<Media?> Exists(string uuid);
        public Task<ApiResponse<MediaDto>> SafeDelete(string uuid);
        public Task<ApiResponse<double>> SumStorage();
    }
}