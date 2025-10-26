using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using FrcsPos.Context;
using FrcsPos.DTO;
using FrcsPos.Interfaces;
using FrcsPos.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FrcsPos.Data
{
    public interface IDbInitializer
    {
        Task SeedAsync();
    }

    public class DbInitializer : IDbInitializer
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMediaRepository _mediaRepository;
        private readonly IWebHostEnvironment _env;

        public DbInitializer(
            ApplicationDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IMediaRepository mediaRepository,
            IWebHostEnvironment env
        )
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _mediaRepository = mediaRepository;
            _env = env;
        }

        public async Task SeedAsync()
        {
            await SeedSuperAdmin(_userManager);
            await SeedCompaniesFromJson(_context, _userManager, _mediaRepository, _env);
            await SeedSuppliers(_context, _env);
            await SeedWarehouses(_context, _env);
            await SeedTaxes(_context, _env);
            await SeedProductsForCompany1(_context, _env);
        }

        private static async Task SeedSuperAdmin(UserManager<User> userManager)
        {
            if (!await userManager.Users.AnyAsync())
            {
                var admin = new User
                {
                    UserName = "superadmin",
                    Email = "rudrprasad@yahoo.com",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(admin, "=TV6Cx>PKqjV");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "superadmin");
                }
            }
        }

        private static async Task SeedCompaniesFromJson(ApplicationDbContext context, UserManager<User> userManager, IMediaRepository mediaRepository, IWebHostEnvironment env)
        {
            if (await context.Companies.AnyAsync()) return;

            var jsonPath = Path.Combine(
                env.ContentRootPath,
                "Data",
                "Seed",
                "companies.json"
            );

            var json = await File.ReadAllTextAsync(jsonPath);
            var companyDtos = JsonSerializer.Deserialize<List<CompanySeedDto>>(json,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (companyDtos == null || !companyDtos.Any()) return;

            var companies = new List<Company>();
            foreach (var dto in companyDtos)
            {
                var adminUser = await userManager.FindByEmailAsync(dto.AdminEmail);

                if (adminUser == null)
                {
                    adminUser = new User
                    {
                        UserName = dto.AdminEmail,
                        Email = dto.AdminEmail,
                        EmailConfirmed = true,
                    };

                    var result = await userManager.CreateAsync(adminUser, dto.AdminPassword);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, "admin");
                        var imagePath = Path.Combine(env.ContentRootPath, "seed-images", dto.AdminImage);

                        if (File.Exists(imagePath))
                        {
                            var media = await CreateMediaFromFile(imagePath, dto.AdminImage, mediaRepository);
                            if (media != null)
                            {
                                adminUser.ProfilePictureId = media.Id;
                                await userManager.UpdateAsync(adminUser);
                            }
                        }
                    }
                }

                companies.Add(new Company
                {
                    Name = dto.Name,
                    AdminUserId = adminUser.Id,
                    CreatedOn = DateTime.UtcNow
                });
            }

            await context.Companies.AddRangeAsync(companies);
            await context.SaveChangesAsync();

            Console.WriteLine($"[SUCCESS] Seeded {companies.Count} companies with admin users");
        }

        private static async Task SeedSuppliers(ApplicationDbContext context, IWebHostEnvironment env)
        {
            if (await context.Suppliers.AnyAsync())
            {
                Console.WriteLine("[WARN] Suppliers already seeded, skipping...");
                return;
            }

            try
            {
                var jsonPath = Path.Combine(env.ContentRootPath, "Data", "Seed", "suppliers.json");

                if (!File.Exists(jsonPath))
                {
                    Console.WriteLine($"[ERROR] Suppliers seed file not found at: {jsonPath}");
                    return;
                }

                var json = await File.ReadAllTextAsync(jsonPath);
                var supplierDtos = JsonSerializer.Deserialize<List<SupplierSeedDto>>(json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (supplierDtos == null || !supplierDtos.Any())
                {
                    Console.WriteLine("[ERROR] No suppliers found in JSON file");
                    return;
                }

                var companies = await context.Companies.OrderBy(c => c.Name).ToListAsync();

                if (!companies.Any())
                {
                    Console.WriteLine("[ERROR] No companies found. Seed companies first.");
                    return;
                }

                var allSuppliers = new List<Supplier>();
                int supplierIndex = 0;

                // Distribute suppliers evenly: 5 per company
                foreach (var company in companies)
                {
                    for (int i = 0; i < 5; i++)
                    {
                        if (supplierIndex >= supplierDtos.Count)
                            break;

                        var dto = supplierDtos[supplierIndex];
                        var companyPrefix = new string(company.Name.Where(char.IsLetterOrDigit).Take(3).ToArray()).ToUpper();

                        var supplier = new Supplier
                        {
                            Name = dto.Name,
                            Code = $"{companyPrefix}-{dto.Code}",
                            ContactName = dto.ContactName,
                            Phone = dto.Phone,
                            Email = dto.Email,
                            Address = dto.Address,
                            TaxNumber = dto.TaxNumber,
                            CompanyId = company.Id,
                            CreatedOn = DateTime.UtcNow
                        };

                        allSuppliers.Add(supplier);
                        supplierIndex++;
                    }
                }

                await context.Suppliers.AddRangeAsync(allSuppliers);
                await context.SaveChangesAsync();

                Console.WriteLine($"[SUCCESS] Seeded {allSuppliers.Count} Fiji suppliers for {companies.Count} companies");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] seeding suppliers: {ex.Message}");
                throw;
            }
        }

        private static async Task SeedWarehouses(ApplicationDbContext context, IWebHostEnvironment env)
        {
            if (await context.Warehouses.AnyAsync())
            {
                Console.WriteLine("[WARN] Warehouses already seeded, skipping...");
                return;
            }

            try
            {
                var jsonPath = Path.Combine(env.ContentRootPath, "Data", "Seed", "warehouses.json");

                if (!File.Exists(jsonPath))
                {
                    Console.WriteLine($"[ERROR] Warehouses seed file not found at: {jsonPath}");
                    return;
                }

                var json = await File.ReadAllTextAsync(jsonPath);
                var warehouseDtos = JsonSerializer.Deserialize<List<WarehouseSeedDto>>(json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (warehouseDtos == null || !warehouseDtos.Any())
                {
                    Console.WriteLine("[ERROR] No warehouses found in JSON file");
                    return;
                }

                var companies = await context.Companies.OrderBy(c => c.Name).ToListAsync();

                if (!companies.Any())
                {
                    Console.WriteLine("[ERROR] No companies found. Seed companies first.");
                    return;
                }

                var allWarehouses = new List<Warehouse>();

                foreach (var company in companies)
                {
                    var companyPrefix = new string(company.Name.Where(char.IsLetterOrDigit).Take(3).ToArray()).ToUpper();

                    foreach (var dto in warehouseDtos)
                    {
                        var warehouse = new Warehouse
                        {
                            Name = dto.Name,
                            Location = dto.Location,
                            CompanyId = company.Id,
                            CreatedOn = DateTime.UtcNow
                        };

                        allWarehouses.Add(warehouse);
                    }
                }

                await context.Warehouses.AddRangeAsync(allWarehouses);
                await context.SaveChangesAsync();

                Console.WriteLine($"[SUCCESS] Seeded {allWarehouses.Count} warehouses ({warehouseDtos.Count} per company for {companies.Count} companies)");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error seeding warehouses: {ex.Message}");
                throw;
            }
        }

        private static async Task SeedTaxes(ApplicationDbContext context, IWebHostEnvironment env)
        {
            if (await context.TaxCategories.AnyAsync())
            {
                Console.WriteLine("[WARN] Taxes already seeded, skipping...");
                return;
            }

            try
            {
                var jsonPath = Path.Combine(env.ContentRootPath, "Data", "Seed", "tax.json");

                if (!File.Exists(jsonPath))
                {
                    Console.WriteLine($"[ERROR] Taxes seed file not found at: {jsonPath}");
                    return;
                }

                var json = await File.ReadAllTextAsync(jsonPath);
                var taxDtos = JsonSerializer.Deserialize<List<TaxSeedDto>>(json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (taxDtos == null || !taxDtos.Any())
                {
                    Console.WriteLine("[ERROR] No taxes found in JSON file");
                    return;
                }

                var taxes = taxDtos.Select(dto => new TaxCategory
                {
                    Name = dto.Name,
                    RatePercent = dto.RatePercent,
                    IsActive = dto.IsActive,
                    IsDeleted = dto.IsDeleted,
                    CreatedOn = DateTime.UtcNow,
                }).ToList();

                await context.TaxCategories.AddRangeAsync(taxes);
                await context.SaveChangesAsync();

                Console.WriteLine($"[SUCCESS] Seeded {taxes.Count} tax rates (VAT 12.5%, VAT Exempt 0%, Heavy Goods 30% - deleted)");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] seeding taxes: {ex.Message}");
                throw;
            }
        }

        private static async Task SeedProductsForCompany1(ApplicationDbContext context, IWebHostEnvironment env)
        {
            const int companyId = 1;

            if (await context.Products.AnyAsync(p => p.CompanyId == companyId))
            {
                Console.WriteLine($"[WARN] Products for company {companyId} already seeded, skipping...");
                return;
            }

            try
            {
                var jsonPath = Path.Combine(env.ContentRootPath, "Data", "Seed", "products-company-1.json");

                if (!File.Exists(jsonPath))
                {
                    Console.WriteLine($"[ERROR] Products seed file not found at: {jsonPath}");
                    return;
                }

                var json = await File.ReadAllTextAsync(jsonPath);
                var productDtos = JsonSerializer.Deserialize<List<ProductSeedDto>>(json,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (productDtos == null || !productDtos.Any())
                {
                    Console.WriteLine("[ERROR] No products found in JSON file");
                    return;
                }

                // Get suppliers for this company
                var suppliers = await context.Suppliers
                    .Where(s => s.CompanyId == companyId)
                    .ToListAsync();

                if (!suppliers.Any())
                {
                    Console.WriteLine($"[ERROR] No suppliers found for company {companyId}");
                    return;
                }

                var random = new Random();
                var allProducts = new List<Product>();
                var allVariants = new List<ProductVariant>();

                foreach (var dto in productDtos)
                {
                    // Randomly assign a supplier (5 suppliers, ~4 products each)
                    var supplier = suppliers[random.Next(suppliers.Count)];

                    var product = new Product
                    {
                        CompanyId = companyId,
                        SupplierId = supplier.Id,
                        Name = dto.Name,
                        Sku = dto.Sku,
                        IsPerishable = dto.IsPerishable,
                        FirstWarningInDays = dto.FirstWarningInDays,
                        CriticalWarningInHours = dto.CriticalWarningInHours,
                        TaxCategoryId = dto.TaxCategoryId
                    };

                    allProducts.Add(product);
                }

                // Add products first to get IDs
                await context.Products.AddRangeAsync(allProducts);
                await context.SaveChangesAsync();

                // Now add variants with product IDs
                for (int i = 0; i < productDtos.Count; i++)
                {
                    var dto = productDtos[i];
                    var product = allProducts[i];

                    foreach (var variantDto in dto.Variants)
                    {
                        var variant = new ProductVariant
                        {
                            ProductId = product.Id,
                            Name = variantDto.Name,
                            Sku = variantDto.Sku,
                            Barcode = variantDto.Barcode,
                            Price = variantDto.Price,
                            FirstWarningInDays = variantDto.FirstWarningInDays,
                            CriticalWarningInHours = variantDto.CriticalWarningInHours
                        };

                        allVariants.Add(variant);
                    }
                }

                await context.ProductVariants.AddRangeAsync(allVariants);
                await context.SaveChangesAsync();

                Console.WriteLine($"[SUCCESS] Seeded {allProducts.Count} products with {allVariants.Count} variants for company {companyId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] seeding products: {ex.Message}");
                throw;
            }
        }

        private static async Task<MediaDto?> CreateMediaFromFile(
            string filePath,
            string fileName,
            IMediaRepository mediaRepository)
        {
            try
            {
                // Read file into memory
                var bytes = await File.ReadAllBytesAsync(filePath);
                var stream = new MemoryStream(bytes);

                // Create IFormFile from the file
                var formFile = new FormFile(stream, 0, bytes.Length, "file", fileName)
                {
                    Headers = new HeaderDictionary(),
                    ContentType = GetContentType(fileName)
                };

                var mediaToBeCreated = new Media
                {
                    AltText = fileName,
                    FileName = fileName,
                    ShowInGallery = false, // Don't show seed images in gallery
                    SizeInBytes = bytes.Length,
                    ContentType = formFile.ContentType
                };

                var newMedia = await mediaRepository.CreateAsync(mediaToBeCreated, file: formFile);

                Console.WriteLine($"[SUCCESS] Created media: {fileName}");
                return newMedia.Data;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Failed to create media for {fileName}: {ex.Message}");
                return null;
            }
        }

        private static string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };
        }
    }
    class CompanySeedDto
    {
        public string Name { get; set; } = default!;
        public string AdminEmail { get; set; } = default!;
        public string AdminPassword { get; set; } = default!;
        public string AdminImage { get; set; } = default!;
    }
    class SupplierSeedDto
    {
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;
    }

    // DTOs/SeedDTOs.cs
    public class WarehouseSeedDto
    {
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
    }
    // DTOs/SeedDTOs.cs
    public class TaxSeedDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal RatePercent { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class ProductSeedDto
    {
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public bool IsPerishable { get; set; }
        public int? FirstWarningInDays { get; set; }
        public int? CriticalWarningInHours { get; set; }
        public int TaxCategoryId { get; set; }
        public List<ProductVariantSeedDto> Variants { get; set; } = new();
    }

    public class ProductVariantSeedDto
    {
        public string Name { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public string Barcode { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int? FirstWarningInDays { get; set; }
        public int? CriticalWarningInHours { get; set; }
    }
}

