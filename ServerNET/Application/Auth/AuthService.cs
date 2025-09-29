using System;
using Application.Core;
using Application.DTOs.Auth;
using Application.Interfaces.Auth;
using Application.Interfaces.Core;
using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using Domain;

namespace Application.Auth;

public class AuthService(
    ITokenGenerator tokenGenerator,
    IServiceHelper<AuthService> serviceHelper,
    IUserRepository userRepository,
    IUserAccessor userAccessor
) : IAuthService
{
    private readonly ITokenGenerator _tokenGenerator = tokenGenerator;
    private readonly IServiceHelper<AuthService> _serviceHelper = serviceHelper;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IUserAccessor _userAccessor = userAccessor;

    public async Task<Result<AuthResultDto>> Login(LoginUserDto loginUserDto)
    {
        return await _serviceHelper.ExecuteSafeAsync( async() =>
        {
            var user = await _userRepository.GetByEmailAsync(loginUserDto.Email);

            if (user == null)
                return Result<AuthResultDto>.Failure("User does not exist", 400);


            bool passwordMatches = BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.Password);

            if (!passwordMatches)
                return Result<AuthResultDto>.Failure("Password is incorrect", 400);


            var token = _tokenGenerator.GenerateToken(user);
            user.Password = "";

            return Result<AuthResultDto>.Success(new AuthResultDto
            {
                Token = token,
                User = user
            });

        });
    }

    public async Task<Result<AuthResultDto>> Register(RegisterUserDto registerUserDto)
    {
        return await _serviceHelper.ExecuteSafeAsync( async() =>
        {
            var userExists = await _userRepository.GetByEmailAsync(registerUserDto.Email);

            if (userExists != null)
                return Result<AuthResultDto>.Failure("User already exists", 400);


            var user = new User
            {
                Email = registerUserDto.Email,
                Name = registerUserDto.Name,
                PictureUrl = registerUserDto.PictureUrl ?? string.Empty,
                Password = BCrypt.Net.BCrypt.HashPassword(registerUserDto.Password),
                PictureId = registerUserDto.PictureId ?? "default"
            };

            await _userRepository.InsertUserAsync(user);

            user.Password = null!;

            var token = _tokenGenerator.GenerateToken(user);

            return Result<AuthResultDto>.Success(new AuthResultDto
            {
                Token = token,
                User = user
            });
        });
    }

    public async Task<Result<AuthResultDto>> GetAuthenticatedUser()
    {
        return await _serviceHelper.ExecuteSafeAsync( async() =>
        {
            var user = await _userRepository.GetById(_userAccessor.GetUserId()!);

            if (user == null)
                return Result<AuthResultDto>.Failure("User does not exist", 404);

            user.Password = null!;
            return Result<AuthResultDto>.Success(new AuthResultDto
            {
                User = user
            });
        });
    }
}
