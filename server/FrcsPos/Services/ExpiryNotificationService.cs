using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Models;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Services
{
    public class ExpiryNotificationService : BackgroundService
    {
        private readonly IServiceProvider _provider;

        public ExpiryNotificationService(IServiceProvider provider)
        {
            _provider = provider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    Console.WriteLine("ExpiryNotificationService started");
                    using var scope = _provider.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var now = DateTime.UtcNow;
                    var warningDays = 7;   // could come from config
                    var criticalHours = 24;

                    var soonToExpire = await db.ProductBatches
                        // .Include(b => b.Product) // ensure Product is loaded
                        .Where(b => b.ExpiryDate != null)
                        .Where(b =>
                            b.ExpiryDate <= now ||
                            b.ExpiryDate <= now.AddHours(criticalHours) ||
                            b.ExpiryDate <= now.AddDays(warningDays)
                        )
                        .ToListAsync(stoppingToken);

                    foreach (var batch in soonToExpire)
                    {
                        var timeLeft = batch.ExpiryDate!.Value - now;

                        NotificationType type;
                        if (timeLeft.TotalSeconds <= 0)
                            type = NotificationType.ERROR; // expired
                        else if (timeLeft.TotalHours <= criticalHours)
                            type = NotificationType.WARNING; // critical
                        else
                            type = NotificationType.INFO; // early warning

                        // Example uniqueness check via ActionUrl instead of ProductBatchId
                        var actionUrl = $"company/{batch.CompanyId}/warehouse/{batch.WarehouseId}/batch/{batch.Id}";

                        bool alreadyNotified = await db.Notifications
                            .AnyAsync(n => n.ActionUrl == actionUrl && n.Type == type, stoppingToken);

                        if (!alreadyNotified)
                        {
                            db.Notifications.Add(new Notification
                            {
                                Title = "Batch expiry alert",
                                Message = $"Batch {batch.Id} for  is {type.ToString().ToLower()} (expires {batch.ExpiryDate})",
                                Type = type,
                                CompanyId = batch.CompanyId,
                                ActionUrl = actionUrl,
                                CreatedOn = now
                            });
                        }

                        Console.WriteLine($"Expiry check created notification for batch {batch.Id}");
                    }

                    await db.SaveChangesAsync(stoppingToken);
                    Console.WriteLine("ExpiryNotificationService finished run");

                    await Task.Delay(TimeSpan.FromHours(12), stoppingToken); // every 12h
                }
            }
            catch (OperationCanceledException)
            {
                // expected on shutdown, swallow
                Console.WriteLine("ExpiryNotificationService stopped gracefully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ExpiryNotificationService crashed: {ex}");
                throw; // let host know it’s a real failure
            }
        }

    }

}