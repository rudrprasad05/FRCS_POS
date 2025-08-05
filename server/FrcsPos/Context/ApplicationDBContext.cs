using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FrcsPos.Models;

namespace FrcsPos.Context
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }
        public DbSet<Company> Companies => Set<Company>();
        public DbSet<CompanyUser> CompanyUsers => Set<CompanyUser>();
        public DbSet<Warehouse> Warehouses => Set<Warehouse>();
        public DbSet<PosTerminal> PosTerminals => Set<PosTerminal>();
        public DbSet<PosSession> PosSessions => Set<PosSession>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<ProductBatch> ProductBatches => Set<ProductBatch>();
        public DbSet<TaxCategory> TaxCategories => Set<TaxCategory>();
        public DbSet<Sale> Sales => Set<Sale>();
        public DbSet<SaleItem> SaleItems => Set<SaleItem>();
        public DbSet<RefundRequest> RefundRequests => Set<RefundRequest>();
        public DbSet<RefundItem> RefundItems => Set<RefundItem>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<QuickConnect> QuickConnect => Set<QuickConnect>();
        

        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole{Name = "superadmin", NormalizedName = "SUPERADMIN"},
                new IdentityRole{Name = "admin", NormalizedName = "ADMIN"},
                new IdentityRole{Name = "cashier", NormalizedName = "CASHIER"},
                new IdentityRole{Name = "user", NormalizedName = "USER"}
            };
            b.UseCollation("utf8mb4_general_ci");
            b.Entity<IdentityRole>().HasData(roles);
            b.Entity<IdentityUserLogin<string>>().HasKey(login => new { login.LoginProvider, login.ProviderKey });
            b.Entity<IdentityUserRole<string>>().HasKey(role => new { role.UserId, role.RoleId });
            b.Entity<IdentityUserToken<string>>().HasKey(token => new { token.UserId, token.LoginProvider, token.Name });

            b.Entity<User>(e =>
            {
                e.HasIndex(x => x.Email).IsUnique();
            });

            b.Entity<Company>(e =>
            {
                e.HasOne(x => x.AdminUser)
                .WithMany()
                .HasForeignKey(x => x.AdminUserId)
                .OnDelete(DeleteBehavior.Restrict);

                e.HasIndex(x => x.Name);
            });

            b.Entity<CompanyUser>(e =>
            {
                e.HasKey(x => new { x.CompanyId, x.UserId });
                e.HasOne(x => x.Company).WithMany(x => x.Users).HasForeignKey(x => x.CompanyId).OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.User).WithMany(x => x.Companies).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            b.Entity<Warehouse>(e =>
            {
                e.HasIndex(x => new { x.CompanyId, x.Name }).IsUnique();
            });

            b.Entity<PosTerminal>(e =>
            {
                e.HasIndex(x => new { x.CompanyId, x.Name }).IsUnique();
                e.HasIndex(x => x.SerialNumber);
            });

            b.Entity<PosSession>(e =>
            {
                e.HasOne(x => x.PosTerminal).WithMany(x => x.Session)
                    .HasForeignKey(x => x.PosTerminalId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.PosUser).WithMany()
                    .HasForeignKey(x => x.PosUserId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(x => x.QuickConnect)
                    .WithOne(q => q.PosSession)
                    .HasForeignKey<QuickConnect>(q => q.PosSessionId)
                    .OnDelete(DeleteBehavior.Cascade); 
                    
            });

            b.Entity<TaxCategory>(e =>
            {
                e.Property(x => x.RatePercent).HasPrecision(5, 2); // e.g., 0, 15.00
                e.HasIndex(x => new { x.CompanyId, x.Name }).IsUnique();
            });

            b.Entity<Product>(e =>
            {
                e.Property(x => x.Price).HasPrecision(18, 2);
                e.HasIndex(x => new { x.CompanyId, x.Sku }).IsUnique();
                e.HasIndex(x => new { x.CompanyId, x.Barcode }).IsUnique().HasFilter("[Barcode] IS NOT NULL");
            });

            b.Entity<ProductBatch>(e =>
            {
                e.HasIndex(x => new { x.CompanyId, x.ProductId, x.WarehouseId });
            });

            b.Entity<Sale>(e =>
            {
                e.Property(x => x.Subtotal).HasPrecision(18, 2);
                e.Property(x => x.TaxTotal).HasPrecision(18, 2);
                e.Property(x => x.Total).HasPrecision(18, 2);

                e.HasIndex(x => new { x.CompanyId, x.InvoiceNumber }).IsUnique();

                // Configure the relationship to PosSession using composite key
                e.HasOne(x => x.PosSession)
                    .WithMany(x => x.Sales)
                    .HasForeignKey(x => new { x.PosSessionId })
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.Cashier)
                    .WithMany(x => x.SalesAsCashier)
                    .HasForeignKey(x => x.CashierId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            b.Entity<SaleItem>(e =>
            {
                e.Property(x => x.UnitPrice).HasPrecision(18, 2);
                e.Property(x => x.TaxRatePercent).HasPrecision(5, 2);
                e.Property(x => x.LineTotal).HasPrecision(18, 2);
            });

            b.Entity<RefundRequest>(e =>
            {
                e.HasOne(x => x.Sale).WithMany(x => x.Refunds)
                    .HasForeignKey(x => x.SaleId).OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.RequestedBy).WithMany().HasForeignKey(x => x.RequestedByUserId).OnDelete(DeleteBehavior.Restrict);
                e.HasOne(x => x.ApprovedBy).WithMany().HasForeignKey(x => x.ApprovedByUserId).OnDelete(DeleteBehavior.Restrict);
            });

            b.Entity<RefundItem>(e =>
            {
                e.HasOne(x => x.RefundRequest).WithMany(x => x.Items)
                    .HasForeignKey(x => x.RefundRequestId).OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.SaleItem).WithMany().HasForeignKey(x => x.SaleItemId).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}