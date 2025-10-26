using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using FrcsPos.Context;
using FrcsPos.Repository;
using FrcsPos.Models;
using FrcsPos.Request;
using FrcsPos.Interfaces;
using FrcsPos.Mappers;
using FrcsPos.Response.DTO;
using FrcsPos.Services;

namespace FrcsPos.Tests.Repository
{
    public class CheckoutRepositoryTest : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly CheckoutRepository _repository;


        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly Mock<IEmailService> _mockEmailService;
        private readonly Mock<UserManager<User>> _mockUserManager;
        private readonly Mock<IAzureBlobService> _mockAzureBlobService;
        private readonly Mock<ISaleMapper> _mockSaleMapper;
        private readonly Mock<IRedisCacheService> _mockRedisCacheService;

        public CheckoutRepositoryTest()
        {

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);


            _mockNotificationService = new Mock<INotificationService>();
            _mockEmailService = new Mock<IEmailService>();
            _mockAzureBlobService = new Mock<IAzureBlobService>();
            _mockSaleMapper = new Mock<ISaleMapper>();
            _mockRedisCacheService = new Mock<IRedisCacheService>();


            var userStoreMock = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(
                userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);


            _repository = new CheckoutRepository(
                _context,
                _mockNotificationService.Object,
                _mockUserManager.Object,
                _mockAzureBlobService.Object,
                _mockSaleMapper.Object,
                _mockEmailService.Object,
                _mockRedisCacheService.Object
            );
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task FullFlow_StockDeducted_SalePersisted_MapperCalled_ReturnsOkDto()
        {
            var company = new Company { Id = 1, Name = "ACME Corp", AdminUserId = "admin-user" };
            _context.Companies.Add(company);

            var tax = new TaxCategory { Id = 1, RatePercent = 10m, Name = "tax" };
            _context.TaxCategories.Add(tax);

            // Product + Variant
            var product = new Product { Id = 1, TaxCategoryId = 1, TaxCategory = tax, Sku = "SKU001", Name = "product" };
            var variant = new ProductVariant
            {
                Id = 1,
                ProductId = 1,
                Product = product,
                Price = 50m,
                Barcode = "1000",
                Sku = "sku",
                Name = "pv"
            };
            _context.Products.Add(product);
            _context.ProductVariants.Add(variant);

            // Two batches (FIFO – older first)
            var oldBatch = new ProductBatch
            {
                Id = 1,
                ProductVariantId = 1,
                ProductVariant = variant,
                Warehouse = new Warehouse { CompanyId = 1, Name = "wh1" },
                Quantity = 3,
                ExpiryDate = DateTime.UtcNow.AddDays(5)      // older
            };
            var newBatch = new ProductBatch
            {
                Id = 2,
                ProductVariantId = 1,
                ProductVariant = variant,
                Warehouse = new Warehouse { CompanyId = 1, Name = "wh1" },
                Quantity = 5,
                ExpiryDate = DateTime.UtcNow.AddDays(30)     // newer
            };
            _context.ProductBatches.AddRange(oldBatch, newBatch);

            // POS session (active)
            var session = new PosSession
            {
                Id = 10,
                IsActive = true,
                ConnectionUUID = Guid.NewGuid().ToString(),
                PosUserId = "cashier.Id",
            };
            _context.PosSessions.Add(session);

            // Cashier (Identity user)
            var cashier = new User { Id = "cashier-1", UserName = "john.doe" };
            _context.Users.Add(cashier);

            await _context.SaveChangesAsync();

            _mockUserManager
                .Setup(m => m.FindByIdAsync("cashier-1"))
                .ReturnsAsync(cashier);


            var expectedDto = new SaleDTO(); // fill if you need specific values
            _mockSaleMapper.Setup(m => m.FromModelToDtoAsync(It.IsAny<Sale>())).ReturnsAsync(expectedDto);

            var request = new NewCheckoutRequest
            {
                CompanyName = "ACME Corp",
                PosSessionId = 10,
                CashierId = "cashier-1",
                Items = new List<SaleItemDTO>
                {
                    new SaleItemDTO
                    {
                        ProductVariant = new ProductVariantDTO
                        {
                            Id = 1,
                            ProductId = 1,
                            Product = product.FromModelToDtoStatic(),
                            Price = 50m,
                            Barcode = "1000",
                            Sku = "sku",
                            Name = "pv",
                            TaxCategory = product.TaxCategory.FromModelToDto(),
                        },
                        Quantity = 6,
                        UnitPrice = variant.Price,
                    }
                }
            };

            var result = await _repository.CreateCheckoutAsync(request);

            result.Success.Should().BeTrue();
            result.Data.Should().Be(expectedDto);

            var persistedSale = await _context.Sales
                .Include(s => s.Items)
                .FirstOrDefaultAsync();

            persistedSale.Should().NotBeNull();
            persistedSale!.CompanyId.Should().Be(1);
            persistedSale.PosSessionId.Should().Be(10);
            persistedSale.CashierId.Should().Be("cashier-1");
            persistedSale.Status.Should().Be(SaleStatus.COMPLETED);

            // Invoice format: first 2 letters + UTC timestamp
            var now = DateTime.UtcNow;

            // Financials
            persistedSale.Subtotal.Should().Be(300m);   // 6 * 50
            persistedSale.TaxTotal.Should().Be(30m);    // 300 * 0.1
            persistedSale.Total.Should().Be(330m);

            // One SaleItem
            persistedSale.Items.Should().HaveCount(1);
            var item = persistedSale.Items.ToList()[0];
            item.ProductVariantId.Should().Be(1);
            item.Quantity.Should().Be(6);
            item.UnitPrice.Should().Be(50m);
            item.TaxRatePercent.Should().Be(10m);
            item.LineTotal.Should().Be(330m);

            var updatedOld = await _context.ProductBatches.FindAsync(1);
            var updatedNew = await _context.ProductBatches.FindAsync(2);

            updatedOld!.Quantity.Should().Be(0);
            updatedNew!.Quantity.Should().Be(2);

            // _mockSaleMapper.Verify(m => m.FromModelToDtoAsync(persistedSale), Times.Once);
        }



        [Fact]
        public async Task CreateCheckoutAsync_WithEmptyItems_ReturnsFail()
        {

            var request = new NewCheckoutRequest
            {
                Items = [],
                CompanyName = "TestCo",
                PosSessionId = 1,
                CashierId = "cashier-123"
            };


            var result = await _repository.CreateCheckoutAsync(request);


            Assert.False(result.Success);
            Assert.Equal("sale is empty", result.Message);
        }

        [Fact]
        public async Task CreateCheckoutAsync_WithNonExistentCompany_ReturnsFail()
        {

            var request = new NewCheckoutRequest
            {
                Items = new List<SaleItemDTO>
                {
                    new SaleItemDTO
                    {
                        ProductVariant = new ProductVariantDTO { Id = 1, ProductId = 1, Price = 10.0m },
                        Quantity = 2,
                        UnitPrice = 10.0m
                    }
                },
                CompanyName = "NonExistentCompany",
                PosSessionId = 1,
                CashierId = "cashier-123"
            };


            var result = await _repository.CreateCheckoutAsync(request);


            Assert.False(result.Success);
            Assert.Equal("Company not found", result.Message);
        }

        [Fact]
        public async Task CreateCheckoutAsync_WithInactiveSession_ReturnsFail()
        {

            var company = new Company
            {
                Id = 1,
                Name = "TestCo",
                AdminUserId = "admin-123"
            };
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            var request = new NewCheckoutRequest
            {
                Items = new List<SaleItemDTO>
                {
                    new SaleItemDTO
                    {
                        ProductVariant = new ProductVariantDTO { Id = 1, ProductId = 1, Price = 10.0m },
                        Quantity = 2,
                        UnitPrice = 10.0m
                    }
                },
                CompanyName = "TestCo",
                PosSessionId = 999,
                CashierId = "cashier-123"
            };


            var result = await _repository.CreateCheckoutAsync(request);


            Assert.False(result.Success);
            Assert.Equal("POS session not found", result.Message);
        }

        [Fact]
        public async Task CreateCheckoutAsync_WithNonExistentCashier_ReturnsFail()
        {

            var company = new Company
            {
                Id = 1,
                Name = "TestCo",
                AdminUserId = "admin-123"
            };
            _context.Companies.Add(company);

            var session = new PosSession
            {
                Id = 1,
                IsActive = true,
                ConnectionUUID = Guid.NewGuid().ToString(),
                PosUserId = "cashier.Id",
            };
            _context.PosSessions.Add(session);
            await _context.SaveChangesAsync();

            _mockUserManager.Setup(um => um.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);

            var request = new NewCheckoutRequest
            {
                Items = new List<SaleItemDTO>
                {
                    new SaleItemDTO
                    {
                        ProductVariant = new ProductVariantDTO { Id = 1, ProductId = 1, Price = 10.0m },
                        Quantity = 2,
                        UnitPrice = 10.0m
                    }
                },
                CompanyName = "TestCo",
                PosSessionId = 1,
                CashierId = "non-existent-cashier"
            };


            var result = await _repository.CreateCheckoutAsync(request);


            Assert.False(result.Success);
            Assert.Equal("Cashier not found", result.Message);
        }

        [Fact]
        public async Task CreateCheckoutAsync_WithInsufficientStock_ReturnsFail()
        {

            var company = new Company
            {
                Id = 1,
                Name = "TestCo",
                AdminUserId = "admin-123"
            };
            _context.Companies.Add(company);

            var cashier = new User
            {
                Id = "cashier-123",
                UserName = "cashier@test.com"
            };

            var session = new PosSession
            {
                Id = 1,
                IsActive = true,
                ConnectionUUID = Guid.NewGuid().ToString(),
                PosUserId = cashier.Id,
            };
            _context.PosSessions.Add(session);

            var taxCategory = new TaxCategory
            {
                Id = 1,
                Name = "Standard",
                RatePercent = 12.5m
            };
            _context.TaxCategories.Add(taxCategory);

            var product = new Product
            {
                Id = 1,
                Name = "Test Product",
                Sku = "TEST-001",
                TaxCategoryId = 1,
                TaxCategory = taxCategory,
                CompanyId = 1
            };
            _context.Products.Add(product);

            var variant = new ProductVariant
            {
                Id = 1,
                ProductId = 1,
                Price = 10.0m,
                Barcode = "10000",
                Sku = "TEST-001-001",
                Name = "Variant"
            };
            _context.ProductVariants.Add(variant);

            var warehouse = new Warehouse
            {
                Id = 1,
                Name = "Main Warehouse",
                CompanyId = 1
            };
            _context.Warehouses.Add(warehouse);


            var batch = new ProductBatch
            {
                Id = 1,
                ProductVariantId = 1,
                ProductVariant = variant,
                WarehouseId = 1,
                Warehouse = warehouse,
                Quantity = 5,
                ExpiryDate = DateTime.UtcNow.AddMonths(6)
            };
            _context.ProductBatches.Add(batch);

            await _context.SaveChangesAsync();

            _mockUserManager.Setup(um => um.FindByIdAsync("cashier-123"))
                .ReturnsAsync(cashier);

            var request = new NewCheckoutRequest
            {
                Items = new List<SaleItemDTO>
                {
                    new SaleItemDTO
                    {
                        ProductVariant = variant.FromModelToDtoStatic(),
                        Quantity = 10,
                        UnitPrice = 10.0m
                    }
                },
                CompanyName = "TestCo",
                PosSessionId = 1,
                CashierId = "cashier-123"
            };


            var result = await _repository.CreateCheckoutAsync(request);


            Assert.False(result.Success);
            Assert.Contains("Not enough stock", result.Message);
        }

        [Fact]
        public async Task GetByUUIDAsync_WithNonExistentSale_ReturnsNotFound()
        {

            var uuid = Guid.NewGuid().ToString();


            var result = await _repository.GetByUUIDAsync(uuid);


            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Sale not found", result.Message);
        }

        [Fact]
        public async Task GetByUUIDAsync_WithValidSale_ReturnsSuccess()
        {

            var company = new Company
            {
                Id = 1,
                Name = "TestCo",
                AdminUserId = "admin-123"
            };
            _context.Companies.Add(company);

            var cashier = new User
            {
                Id = "cashier-123",
                UserName = "cashier@test.com"
            };

            var terminal = new PosTerminal
            {
                Id = 1,
                Name = "Terminal 1",
                CompanyId = 1
            };
            _context.PosTerminals.Add(terminal);

            var session = new PosSession
            {
                Id = 1,
                IsActive = true,
                PosTerminalId = 1,
                PosTerminal = terminal,
                ConnectionUUID = Guid.NewGuid().ToString(),
                PosUserId = cashier.Id,
            };
            _context.PosSessions.Add(session);

            var saleUuid = Guid.NewGuid().ToString();
            var sale = new Sale
            {
                Id = 1,
                UUID = saleUuid,
                CompanyId = 1,
                Company = company,
                PosSessionId = 1,
                PosSession = session,
                CashierId = "cashier-123",
                Cashier = cashier,
                InvoiceNumber = "INV-001",
                Subtotal = 100m,
                TaxTotal = 12.5m,
                Total = 112.5m,
                Status = SaleStatus.COMPLETED
            };
            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            var saleDto = new SaleDTO
            {
                UUID = saleUuid,
                InvoiceNumber = "INV-001"
            };

            _mockSaleMapper.Setup(m => m.FromModelToDtoAsync(It.IsAny<Sale>()))
                .ReturnsAsync(saleDto);


            var result = await _repository.GetByUUIDAsync(saleUuid);


            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(saleUuid, result.Data.UUID);
            _mockSaleMapper.Verify(m => m.FromModelToDtoAsync(It.IsAny<Sale>()), Times.Once);
        }

        [Fact]
        public async Task EmailReceiptPDF_WithNonExistentSale_ReturnsNotFound()
        {

            var uuid = Guid.NewGuid().ToString();
            var email = "customer@test.com";


            var result = await _repository.EmailReceiptPDF(uuid, email);


            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Sale not found", result.Message);
        }
    }
}