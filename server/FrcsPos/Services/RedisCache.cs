using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace FrcsPos.Services
{
    public interface IRedisCacheService
    {
        Task<T?> GetAsync<T>(string key);
        Task SetAsync<T>(string key, T value, TimeSpan? expiry = null);
        Task RemoveAsync(string key);
    }

    public class RedisCacheService : IRedisCacheService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly ILogger<RedisCacheService> _logger;


        public RedisCacheService(IConnectionMultiplexer redis, ILogger<RedisCacheService> logger)
        {
            _redis = redis;
            _logger = logger;
        }

        public async Task<T?> GetAsync<T>(string key)
        {
            try
            {
                if (_redis == null || !_redis.IsConnected)
                {
                    _logger.LogWarning("REDIS: A request to redis was made but redis is OFFLINE");
                    return default;
                }

                var db = _redis.GetDatabase();
                var value = await db.StringGetAsync(key);

                if (value.IsNullOrEmpty)
                {
                    _logger.LogWarning("REDIS: A request to redis was made but NOTHING was returned");
                    return default;
                }


                _logger.LogInformation("REDIS: A request to redis was made and SOMETHING was returned");
                return System.Text.Json.JsonSerializer.Deserialize<T>(value!);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Redis unavailable: {ex.Message}");
                return default;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
        {
            try
            {
                if (_redis == null || !_redis.IsConnected)
                {
                    _logger.LogWarning("REDIS: A request to redis was made but redis is OFFLINE");
                    return;
                }

                var db = _redis.GetDatabase();
                var json = System.Text.Json.JsonSerializer.Serialize(value);
                await db.StringSetAsync(key, json, expiry);

                _logger.LogInformation("REDIS: A request to redis was made and SOMETHING was set");

            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Redis unavailable: {ex.Message}");
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                if (_redis == null || !_redis.IsConnected)
                {
                    _logger.LogWarning("REDIS: A request to redis was made but redis is OFFLINE");
                    return;
                }

                var db = _redis.GetDatabase();
                await db.KeyDeleteAsync(key);

                _logger.LogInformation("REDIS: A request to redis was made and SOMETHING was set");

            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Redis unavailable: {ex.Message}");
            }
        }
    }

}