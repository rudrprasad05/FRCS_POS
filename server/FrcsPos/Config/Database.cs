using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Config
{
    public static class Database
    {
        public static void AddDatabaseContext(this IServiceCollection services, IConfiguration configuration)
        {
            var conn = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Invlaid");
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseMySql(
                    conn,
                    ServerVersion.AutoDetect(conn)
                )
            );
        }
        
    }
}