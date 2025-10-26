using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;          // <-- For ApplicationDbContext
using FrcsPos.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Moq;

using FrcsPos.Repository;
using FrcsPos;
using FrcsPos.Models;
using FrcsPos.Interfaces;
using FrcsPos.Services;
using FrcsPos.Mappers;


namespace FrcsPos.Tests.Repository
{
    public class CompanyRepositoryTest : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly CompanyRepository _repository;

        // Mocks
        private readonly Mock<INotificationService> _mockNotificationService;
        private readonly Mock<IRedisCacheService> _redisCacheService;
        private readonly Mock<UserManager<User>> _mockUserManager;
        private readonly Mock<IUserContext> _mockUserContext;
        private readonly Mock<IUserMapper> _mockUserMapper;

        public CompanyRepositoryTest()
        {
            // Setup in-memory database
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ApplicationDbContext(options);

            // Setup mocks
            _mockNotificationService = new Mock<INotificationService>();
            _redisCacheService = new Mock<IRedisCacheService>();
            _mockUserContext = new Mock<IUserContext>();
            _mockUserMapper = new Mock<IUserMapper>();

            // UserManager<User> is special — needs full mock setup
            var userStoreMock = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(
                userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);

            // Instantiate repository with ALL dependencies
            _repository = new CompanyRepository(
                _context,
                _mockNotificationService.Object,
                _mockUserManager.Object,
                _mockUserContext.Object,
                _mockUserMapper.Object,
                _redisCacheService.Object
            );
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetCompanyByAdminUserId_WhenUserIsAdmin_ReturnsCompany()
        {
            // Arrange
            var adminUserId = "admin-123";
            var company = new Company
            {
                Id = new Random().Next(1, 1000000),

                UUID = Guid.NewGuid().ToString(),
                Name = "Test Company",
                AdminUserId = adminUserId,
                CreatedOn = DateTime.UtcNow
            };

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetCompanyByAdminUserIdAsync(adminUserId);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(company.Id, result.Data.Id);
            Assert.Equal(company.Name, result.Data.Name);
        }
    }
}