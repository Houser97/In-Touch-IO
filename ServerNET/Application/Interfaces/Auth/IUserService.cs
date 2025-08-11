using System;
using Application.Core;
using Application.DTOs.Users;

namespace Application.Interfaces.Auth;

public interface IUserService
{
    Task<Result<List<UserLikeDTO>>> GetUserByNameOrEmail(string? searchTerm);
    Task<Result<UserLikeDTO>> Update(string id, UpdateUserDto updateUserDto);

}
