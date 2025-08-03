using System;
using Application.DTOs;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<AuthResultDto> Login(LoginUserDto loginUserDto);
    Task<AuthResultDto> Register(RegisterUserDto registerUserDto);
    Task<AuthResultDto> GetAuthenticatedUser(string userId);
    
}
