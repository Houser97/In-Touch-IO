using System;
using Application.DTOs;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Persistence;

namespace Application.Auth;

public class AuthService(JwtTokenGenerator tokenGenerator, AppDbContext dbContext, IOptions<AppDbSettings> settings)
{
    private readonly JwtTokenGenerator _tokenGenerator = tokenGenerator;
    private readonly IMongoCollection<User> _usersCollection = dbContext.Database.GetCollection<User>(settings.Value.UsersCollectionName);

    public async Task<AuthResultDto> Login(LoginUserDto loginUserDto)
    {
        var user = await _usersCollection.Find(u => u.Name == loginUserDto.Name).FirstOrDefaultAsync();

        if (user == null)
        {
            return new AuthResultDto
            {
                Success = false,
                Message = "User does not exist"
            };
        }

        bool passwordMatches = BCrypt.Net.BCrypt.Verify(loginUserDto.Password, user.Password);

        if (!passwordMatches)
        {
            return new AuthResultDto
            {
                Success = false,
                Message = "Password is incorrect"
            };
        }


        var token = _tokenGenerator.GenerateToken(user);
        user.Password = "";

        return new AuthResultDto
        {
            Success = true,
            Token = token,
            User = user
        };

    }
}
