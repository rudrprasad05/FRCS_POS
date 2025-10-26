using System;
using Xunit;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Request;

namespace FrcsPos.Tests.Mappers
{
    public class CompanyMapperTest
    {
        [Fact]
        public void FromNewCompanyRequestToModel_WithValidRequest_ReturnsCompany()
        {
            // Arrange
            var request = new NewCompanyRequest
            {
                Name = "Test Company",
                AdminUserId = "admin-123"
            };

            // Act
            var result = request.FromNewCompanyRequestToModel();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(request.Name, result.Name);
            Assert.Equal(request.AdminUserId, result.AdminUserId);
        }

        [Fact]
        public void FromNewCompanyRequestToModel_WithNullRequest_ThrowsArgumentNullException()
        {
            // Arrange
            NewCompanyRequest request = null!;

            // Act & Assert
            Assert.Throws<ArgumentNullException>(() => request.FromNewCompanyRequestToModel());
        }

        [Fact]
        public void FromModelToOnlyDto_WithValidCompany_ReturnsDtoWithBasicFields()
        {
            // Arrange
            var company = new Company
            {
                Id = 1,
                UUID = Guid.NewGuid().ToString(),
                Name = "Test Company",
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow,
                IsDeleted = false,
                AdminUserId = "admin-123"
            };

            // Act
            var result = company.FromModelToOnlyDto();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(company.Id, result.Id);
            Assert.Equal(company.UUID, result.UUID);
            Assert.Equal(company.Name, result.Name);
            Assert.Equal(company.CreatedOn, result.CreatedOn);
            Assert.Equal(company.UpdatedOn, result.UpdatedOn);
        }

        [Fact]
        public void FromModelToOnlyDto_WithNullCompany_ReturnsEmptyDto()
        {
            // Arrange
            Company company = null!;

            // Act
            var result = company.FromModelToOnlyDto();

            // Assert
            Assert.NotNull(result);
            Assert.Equal("default name", result.Name);
        }

        [Fact]
        public void FromModelToDto_WithNullCompany()
        {
            // Arrange
            Company company = null!;

            // Act
            var result = company.FromModelToDto();

            // Assert
            Assert.NotNull(result);
            Assert.Equal("default name", result.Name);
        }

        [Fact]
        public void FromModelToDto_WithValidCompany()
        {
            // Arrange
            var uuid = Guid.NewGuid().ToString().ToUpper();
            var adminUUID = Guid.NewGuid().ToString().ToUpper();
            var createdOn = DateTime.UtcNow;

            Company company = new()
            {
                UUID = uuid,
                Id = 1,
                CreatedOn = createdOn,
                UpdatedOn = createdOn,
                Name = "default-company",
                IsDeleted = false,
                AdminUserId = adminUUID
            };

            // Act
            var result = company.FromModelToDto();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(uuid, result.UUID);
            Assert.Equal(1, result.Id);
            Assert.Equal(createdOn, result.CreatedOn);
            Assert.Equal(createdOn, result.UpdatedOn);
            Assert.Equal("default-company", result.Name);
            Assert.Equal(adminUUID, result.AdminUserId);
            Assert.False(result.IsDeleted);
        }

        [Fact]
        public void FromModelToDTOWithoutPosTerminals_WithValidCompany_ReturnsDtoWithoutTerminals()
        {
            // Arrange
            var adminUser = new User
            {
                Id = "admin-123",
                UserName = "admin@test.com",
                Email = "admin@test.com"
            };

            var company = new Company
            {
                Id = 1,
                UUID = Guid.NewGuid().ToString(),
                Name = "Test Company",
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow,
                AdminUserId = "admin-123",
                AdminUser = adminUser
            };

            // Act
            var result = company.FromModelToDTOWithoutPosTerminals();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(company.Id, result.Id);
            Assert.Equal(company.UUID, result.UUID);
            Assert.Equal(company.Name, result.Name);
            Assert.NotNull(result.AdminUser);
            Assert.Null(result.PosTerminals);
        }

        [Fact]
        public void FromModelToDTOWithoutPosTerminals_WithNullCompany_ReturnsEmptyDto()
        {
            // Arrange
            Company company = null!;

            // Act
            var result = company.FromModelToDTOWithoutPosTerminals();

            // Assert
            Assert.NotNull(result);
        }
    }
}