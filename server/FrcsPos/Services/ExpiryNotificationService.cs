using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FrcsPos.Services
{
    public class ExpiryNotificationService : BackgroundService
    {
        private readonly IServiceProvider _provider;
        private readonly ILogger<ExpiryNotificationService> _logger;

        public ExpiryNotificationService(
            IServiceProvider provider,
            ILogger<ExpiryNotificationService> logger)
        {
            _provider = provider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ExpiryNotificationService is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessExpiryNotificationsAsync(stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("ExpiryNotificationService stopped gracefully.");
                    return;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unexpected error in ExpiryNotificationService.");
                }

                try
                {
                    await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Delay cancelled – shutting down.");
                    return;
                }
            }
        }

        private async Task ProcessExpiryNotificationsAsync(CancellationToken ct)
        {
            _logger.LogDebug("ExpiryNotificationService run started.");

            using var scope = _provider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var now = DateTime.UtcNow;

            var productThresholds = await db.Products
                .Where(p => p.IsPerishable)
                .Select(p => new
                {
                    p.Id,
                    p.CriticalWarningInHours,
                    p.FirstWarningInDays
                })
                .ToDictionaryAsync(p => p.Id, ct);

            if (!productThresholds.Any())
            {
                _logger.LogDebug("No perishable products found.");
                return;
            }

            // Get all batches with expiry date
            var batches = await db.ProductBatches
                .Include(b => b.ProductVariant)
                    .ThenInclude(v => v.Product)
                .Where(b => b.ExpiryDate != null && b.ProductVariant.Product.IsPerishable)
                .ToListAsync(ct);

            var notificationsToAdd = new List<Notification>();

            foreach (var batch in batches)
            {
                var product = batch.ProductVariant.Product;
                var expiry = batch.ExpiryDate!.Value;

                if (!productThresholds.TryGetValue(product.Id, out var thresholds))
                    continue;

                var timeLeft = expiry - now;

                // Determine notification level
                NotificationType type;
                string description;

                if (timeLeft.TotalSeconds <= 0)
                {
                    type = NotificationType.ERROR;
                    description = "expired";
                }
                else if (timeLeft.TotalHours <= thresholds.CriticalWarningInHours)
                {
                    type = NotificationType.WARNING;
                    description = "almost expired";
                }
                else if (timeLeft.TotalDays <= thresholds.FirstWarningInDays)
                {
                    type = NotificationType.INFO;
                    description = "approaching expiry";
                }
                else
                {
                    continue;
                }

                // Uniqueness: ActionUrl + Type
                var actionUrl = $"company/{batch.CompanyId}/warehouse/{batch.WarehouseId}/batch/{batch.Id}";

                bool alreadyNotified = await db.Notifications
                    .AnyAsync(n => n.ActionUrl == actionUrl && n.Type == type, ct);

                if (alreadyNotified)
                    continue;

                // Create notification
                notificationsToAdd.Add(new Notification
                {
                    Title = "Batch expiry alert",
                    Message = $"Batch {batch.Id} is {description} (expires {expiry:yyyy-MM-dd HH:mm} UTC)",
                    Type = type,
                    CompanyId = batch.CompanyId,
                    ActionUrl = actionUrl,
                    CreatedOn = now
                });

                _logger.LogInformation(
                    "Queued {Type} notification for batch {BatchId} - expires {Expiry:u}",
                    type, batch.Id, expiry);
            }

            // Save all at once
            if (notificationsToAdd.Any())
            {
                db.Notifications.AddRange(notificationsToAdd);
                await db.SaveChangesAsync(ct);
                _logger.LogInformation("Saved {Count} new expiry notifications.", notificationsToAdd.Count);
            }
            else
            {
                _logger.LogDebug("No new expiry notifications this run.");
            }

            _logger.LogDebug("ExpiryNotificationService run completed.");
        }
    }
}