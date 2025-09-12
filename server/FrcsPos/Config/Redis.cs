using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace FrcsPos.Config
{
    public static class RedisContext
    {
        public static void AddRedisContext(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<Program>>();

                try
                {
                    var conf = configuration.GetConnectionString("Redis");
                    if (string.IsNullOrWhiteSpace(conf))
                    {
                        logger.LogWarning("Redis connection string not found. Redis caching will be disabled.");
                        return null!;
                    }

                    return ConnectionMultiplexer.Connect(conf);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Redis is unavailable. Falling back without Redis caching.");
                    return null!; // register a null instance, or better, a stub
                }
            });
        }
    }
}