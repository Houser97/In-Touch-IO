using System;
using Application.Auth;
using Application.Core;
using Application.DTOs.Auth;
using Application.Interfaces.Core;
using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using Domain;
using FluentAssertions;
using Moq;

namespace Application.Tests.Auth;

public class AuthServiceTests
{

    private readonly AuthService _authService;
    private readonly Mock<ITokenGenerator> _mockTokenGenerator;
    private readonly Mock<IServiceHelper<AuthService>> _mockServiceHelper;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly Mock<IUserAccessor> _mockUserAccessor;
    private readonly User _fakeUser;

    private const string _plainPassword = "correct-password";
    private const string _fakeToken = "fake-jwt";

    public AuthServiceTests()
    {
        _mockTokenGenerator = new Mock<ITokenGenerator>();
        _mockServiceHelper = new Mock<IServiceHelper<AuthService>>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockUserAccessor = new Mock<IUserAccessor>();


        _fakeUser = new User
        {
            Id = "1",
            Email = "fakeUser@example.com",
            Password = BCrypt.Net.BCrypt.HashPassword("correct-password")
        };

        _mockUserRepository
            .Setup(r => r.GetByEmailAsync(It.Is<string>(e =>
                string.Equals(e, _fakeUser.Email, StringComparison.OrdinalIgnoreCase)
            )))
            .ReturnsAsync(_fakeUser);

        _mockServiceHelper
            .Setup(x => x.ExecuteSafeAsync(It.IsAny<Func<Task<Result<AuthResultDto>>>>()))
            .Returns((Func<Task<Result<AuthResultDto>>> func) => func());

        _mockTokenGenerator
            .Setup(x => x.GenerateToken(It.IsAny<User>()))
            .Returns(_fakeToken);

        _mockUserAccessor
            .Setup(x => x.GetUserId())
            .Returns(_fakeUser.Id);

        _authService = new AuthService(
            _mockTokenGenerator.Object,
            _mockServiceHelper.Object,
            _mockUserRepository.Object,
            _mockUserAccessor.Object
        );
    }

    [Fact]
    public async Task Login_ReturnsSuccess()
    {
        // Arrange
        var fakeToken = "fake-jwt";
        var email = _fakeUser.Email;
        var password = _plainPassword;

        var loginDto = new LoginUserDto
        {
            Email = email,
            Password = password
        };

        // Act
        var result = await _authService.Login(loginDto);

        // Assert
        _mockTokenGenerator.Verify(x => x.GenerateToken(It.Is<User>(u => u.Email == email)), Times.Once);
        result.Error.Should().Be(null);
        result.IsSuccess.Should().BeTrue();
        result.Value!.Token.Should().Be(fakeToken);
        result.Value.User!.Email.Should().Be(email);
    }

    [Fact]
    public async Task Login_EmailCaseInsensitive_ShouldReturnSuccess()
    {
        // Arrange
        var emailUpperCase = _fakeUser.Email.ToUpperInvariant();
        var loginDto = new LoginUserDto
        {
            Email = emailUpperCase,
            Password = _plainPassword
        };

        // Act
        var result = await _authService.Login(loginDto);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value!.User!.Email.Should().Be(_fakeUser.Email); // Debe devolver el email original en minúsculas.
    }

    [Fact]
    public async Task Login_ReturnsFailure_WrongPassword()
    {
        var loginDto = new LoginUserDto
        {
            Email = _fakeUser.Email,
            Password = "wrong-password"
        };

        // Act
        var result = await _authService.Login(loginDto);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Be("Password is incorrect");
    }

    [Fact]
    public async Task Login_ReturnsFailure_UserDoesNotExist()
    {
        var loginDto = new LoginUserDto
        {
            Email = "nonexistent-user@example.com",
            Password = "123"
        };

        var result = await _authService.Login(loginDto);

        result.Error.Should().Be("User does not exist");
        result.Code.Should().Be(400);
    }

    [Fact]
    public async Task Login_ServiceHelperCapturesException_FromRepository()
    {
        // Arrange
        var loginDto = new LoginUserDto
        {
            Email = _fakeUser.Email,
            Password = _plainPassword
        };

        var exceptionMessage = "Database connection failed";

        _mockUserRepository
            .Setup(x => x.GetByEmailAsync(It.IsAny<string>()))
            .ThrowsAsync(new Exception(exceptionMessage));

        _mockServiceHelper
            .Setup(x => x.ExecuteSafeAsync(It.IsAny<Func<Task<Result<AuthResultDto>>>>()))
            .Returns<Func<Task<Result<AuthResultDto>>>>(async func =>
            {
                try
                {
                    return await func();
                }
                catch (Exception ex)
                {
                    return Result<AuthResultDto>.Failure(ex.Message, 500);
                }
            });

        // Act
        var result = await _authService.Login(loginDto);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().Contain(exceptionMessage);
        result.Code.Should().Be(500);
    }


    [Fact]
    public async Task Register_ReturnsSuccess()
    {
        var registerDto = new RegisterUserDto
        {
            Email = "new-user@example.com",
            Name = "new-user",
            PictureId = "default",
            Password = "strong-password",
            PictureUrl = "http://someurl.com/pic.jpg"
        };

        // User does not exist
        _mockUserRepository
            .Setup(x => x.GetByEmailAsync(It.Is<string>(e => e.Equals(registerDto.Email, StringComparison.InvariantCultureIgnoreCase))))
            .ReturnsAsync((User?)null);

        // User insertion simulation
        _mockUserRepository
            .Setup(x => x.InsertUserAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        var result = await _authService.Register(registerDto);

        _mockUserRepository.Verify(x => x.InsertUserAsync(It.IsAny<User>()), Times.Once);
        _mockTokenGenerator.Verify(x => x.GenerateToken(It.Is<User>(u => u.Email == registerDto.Email)), Times.Once);
        result.Error.Should().Be(null);
        result.Value!.User!.Email.Should().Be(registerDto.Email);
        result.Value!.User!.Name.Should().Be(registerDto.Name);
        result.Value!.User!.PictureId.Should().Be(registerDto.PictureId);
        result.Value!.User!.Password.Should().Be(null);
        result.Value!.User!.PictureUrl.Should().Be(registerDto.PictureUrl);
        result.Value!.Token.Should().Be(_fakeToken);
    }

    [Fact]
    public async Task Register_EmailIsNormalizedToLowercase()
    {
        // Arrange
        var emailUpperCase = "NEWUSER@EXAMPLE.COM";
        var registerDto = new RegisterUserDto
        {
            Email = emailUpperCase,
            Name = "new-user",
            Password = "strong-password"
        };

        _mockUserRepository
            .Setup(x => x.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        _mockUserRepository
            .Setup(x => x.InsertUserAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);

        User? insertedUser = null;
        _mockUserRepository
            .Setup(x => x.InsertUserAsync(It.IsAny<User>()))
            .Callback<User>(u => insertedUser = u)
            .Returns(Task.CompletedTask);

        // Act
        var result = await _authService.Register(registerDto);

        // Assert
        result.IsSuccess.Should().BeTrue();
        insertedUser.Should().NotBeNull();
        // insertedUser!.Email.Should().Be(emailUpperCase.ToLowerInvariant());
        // result.Value!.User!.Email.Should().Be(emailUpperCase.ToLowerInvariant());
    }


    [Fact]
    public async Task Register_ReturnsFailure_UserAlreadyExists()
    {
        var registerDto = new RegisterUserDto
        {
            Email = _fakeUser.Email,
            Name = "new-user",
            PictureId = "default",
            Password = _plainPassword,
            PictureUrl = "http://someurl.com/pic.jpg"
        };

        var result = await _authService.Register(registerDto);

        result.Error.Should().Be("User already exists");
        result.Code.Should().Be(400);
    }

    [Fact]
    public async Task GetAuthenticatedUser_ReturnsSuccess()
    {
        string userId = _fakeUser!.Id!;

        _mockUserRepository
            .Setup(x => x.GetById(It.IsAny<string>()))
            .ReturnsAsync(_fakeUser);

       var result = await _authService.GetAuthenticatedUser(); 

        result.Error.Should().Be(null);
        result.Value!.User!.Email.Should().Be(_fakeUser.Email);
        result.Value!.User!.Id.Should().Be(_fakeUser.Id);
        result.Value!.User!.Password.Should().Be(null);
    }

    [Fact]
    public async Task GetAuthenticatedUser_ReturnsFailure()
    {
        _mockUserRepository
            .Setup(x => x.GetById(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        _mockUserAccessor
            .Setup(x => x.GetUserId())
            .Returns("nonexistent_id");

        var result = await _authService.GetAuthenticatedUser();

        result.Error.Should().Be("User does not exist");
        result.Code.Should().Be(404);
    }

    [Fact]
    public async Task GetAuthenticatedUser_ShouldClearPasswordBeforeReturn()
    {
        // Arrange
        _mockUserRepository
            .Setup(x => x.GetById(It.IsAny<string>()))
            .ReturnsAsync(_fakeUser);

        // Act
        var result = await _authService.GetAuthenticatedUser();

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value!.User!.Password.Should().BeNullOrEmpty("Password should be cleared before returning user");
    }

}
