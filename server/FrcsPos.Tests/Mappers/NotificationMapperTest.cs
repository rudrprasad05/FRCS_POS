using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FrcsPos.Mappers;
using FrcsPos.Models;
using FrcsPos.Response.DTO;

namespace FrcsPos.Tests.Mappers
{
    public class NotificationMapperTest
    {
        private readonly Mock<IUserMapper> _mockUserMapper;
        private readonly NotificationMapper _mapper;

        public NotificationMapperTest()
        {
            _mockUserMapper = new Mock<IUserMapper>();
            _mapper = new NotificationMapper(_mockUserMapper.Object);
        }

        [Fact]
        public async Task FromModelToDto_WithValidNotification_ReturnsMappedDto()
        {
            // Arrange
            var company = new Company
            {
                Id = 1,
                UUID = Guid.NewGuid().ToString(),
                Name = "Test Company"
            };

            var user = new User
            {
                Id = "user-123",
                UserName = "testuser",
                Email = "test@example.com"
            };

            var userDto = new UserDTO
            {
                Id = "user-123",
                Username = "testuser",
                Email = "test@example.com"
            };

            var notification = new Notification
            {
                Id = 1,
                UUID = Guid.NewGuid().ToString(),
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow,
                Title = "Test Notification",
                Message = "This is a test message",
                IsRead = false,
                Type = NotificationType.INFO,
                IsSuperAdmin = false,
                ActionUrl = "/test/action",
                UserId = "user-123",
                User = user,
                CompanyId = 1,
                Company = company
            };

            _mockUserMapper.Setup(m => m.FromModelToDtoAsync(user))
                .ReturnsAsync(userDto);

            // Act
            var result = await _mapper.FromModelToDto(notification);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(notification.Id, result.Id);
            Assert.Equal(notification.UUID, result.UUID);
            Assert.Equal(notification.Title, result.Title);
            Assert.Equal(notification.Message, result.Message);
            Assert.Equal(notification.IsRead, result.IsRead);
            Assert.Equal(notification.Type, result.Type);
            Assert.Equal(notification.IsSuperAdmin, result.IsSuperAdmin);
            Assert.Equal(notification.ActionUrl, result.ActionUrl);
            Assert.Equal(notification.UserId, result.UserId);
            Assert.Equal(notification.CompanyId, result.CompanyId);
            Assert.NotNull(result.User);
            Assert.Equal(userDto.Id, result.User.Id);
            Assert.NotNull(result.Company);
            Assert.Equal(company.Id, result.Company.Id);

            _mockUserMapper.Verify(m => m.FromModelToDtoAsync(user), Times.Once);
        }

        [Fact]
        public async Task FromModelToDto_WithNullUser_ReturnsDtoWithoutUser()
        {
            // Arrange
            var notification = new Notification
            {
                Id = 1,
                UUID = Guid.NewGuid().ToString(),
                Title = "Test Notification",
                Message = "Test message",
                UserId = "user-123",
                User = null
            };

            // Act
            var result = await _mapper.FromModelToDto(notification);

            // Assert
            Assert.NotNull(result);
            Assert.Null(result.User);
            Assert.Equal(notification.UserId, result.UserId);

            _mockUserMapper.Verify(m => m.FromModelToDtoAsync(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task FromModelToDto_WithNullCompany_ReturnsDtoWithoutCompany()
        {
            // Arrange
            var notification = new Notification
            {
                Id = 1,
                UUID = Guid.NewGuid().ToString(),
                Title = "Test Notification",
                Message = "Test message",
                CompanyId = 1,
                Company = null
            };

            // Act
            var result = await _mapper.FromModelToDto(notification);

            // Assert
            Assert.NotNull(result);
            Assert.Null(result.Company);
            Assert.Equal(notification.CompanyId, result.CompanyId);
        }

        [Fact]
        public async Task FromModelToDto_WithNullNotification_ReturnsEmptyDto()
        {
            // Arrange
            Notification notification = null!;

            // Act
            var result = await _mapper.FromModelToDto(notification);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.Id);
            Assert.NotNull(result.UUID);
            Assert.Null(result.Title);
            Assert.Null(result.Message);
        }

        [Fact]
        public void FromDtoToModel_WithValidDto_ReturnsMappedModel()
        {
            // Arrange
            var dto = new NotificationDTO
            {
                Id = 1,
                UUID = Guid.NewGuid().ToString(),
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow,
                Title = "Test Notification",
                Message = "This is a test message",
                IsRead = true,
                Type = NotificationType.WARNING,
                IsSuperAdmin = true,
                ActionUrl = "/admin/action",
                UserId = "user-123",
                CompanyId = 1
            };

            // Act
            var result = _mapper.FromDtoToModel(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Id, result.Id);
            Assert.Equal(dto.UUID, result.UUID);
            Assert.Equal(dto.CreatedOn, result.CreatedOn);
            Assert.Equal(dto.UpdatedOn, result.UpdatedOn);
            Assert.Equal(dto.Title, result.Title);
            Assert.Equal(dto.Message, result.Message);
            Assert.Equal(dto.IsRead, result.IsRead);
            Assert.Equal(dto.Type, result.Type);
            Assert.Equal(dto.IsSuperAdmin, result.IsSuperAdmin);
            Assert.Equal(dto.ActionUrl, result.ActionUrl);
            Assert.Equal(dto.UserId, result.UserId);
            Assert.Equal(dto.CompanyId, result.CompanyId);
        }

        [Fact]
        public void FromDtoToModel_WithNullDto_ReturnsEmptyModel()
        {
            // Arrange
            NotificationDTO dto = null!;

            // Act
            var result = _mapper.FromDtoToModel(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.Id);
            Assert.Empty(result.Title);
            Assert.Empty(result.Message);
        }

        [Fact]
        public void FromDtoToModel_DoesNotMapNavigationProperties()
        {
            // Arrange
            var dto = new NotificationDTO
            {
                Id = 1,
                Title = "Test",
                Message = "Message",
                UserId = "user-123",
                CompanyId = 1,
                User = new UserDTO { Id = "user-123" },
                Company = new CompanyDTO { Id = 1 }
            };

            // Act
            var result = _mapper.FromDtoToModel(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Null(result.User);
            Assert.Null(result.Company);
            Assert.Equal(dto.UserId, result.UserId);
            Assert.Equal(dto.CompanyId, result.CompanyId);
        }
    }
}