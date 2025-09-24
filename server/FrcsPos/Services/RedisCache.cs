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
        public RedisCacheService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        public async Task<T?> GetAsync<T>(string key)
        {
            try
            {
                if (_redis == null || !_redis.IsConnected)
                {
                    return default;
                }

                var db = _redis.GetDatabase();
                var value = await db.StringGetAsync(key);

                if (value.IsNullOrEmpty)
                    return default;

                return System.Text.Json.JsonSerializer.Deserialize<T>(value!);
            }
            catch (Exception ex)
            {
                // Optional: log, but don’t crash
                Console.WriteLine($"Redis unavailable: {ex.Message}");
                return default;
            }
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null)
        {
            try
            {
                if (_redis == null || !_redis.IsConnected)
                {
                    // Redis not configured or offline → just skip
                    return;
                }

                var db = _redis.GetDatabase();
                var json = System.Text.Json.JsonSerializer.Serialize(value);
                await db.StringSetAsync(key, json, expiry);
            }
            catch (Exception ex)
            {
                // Optional: log instead of throw
                Console.WriteLine($"Redis unavailable (Set): {ex.Message}");
            }
        }

        public async Task RemoveAsync(string key)
        {
            try
            {
                if (_redis == null || !_redis.IsConnected)
                {
                    // Redis not configured or offline → just skip
                    return;
                }

                var db = _redis.GetDatabase();
                await db.KeyDeleteAsync(key);
            }
            catch (Exception ex)
            {
                // Optional: log instead of throw
                Console.WriteLine($"Redis unavailable (Remove): {ex.Message}");
            }
        }
    }

}