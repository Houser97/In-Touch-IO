using System;
using System.Data.Common;
using Application.Core;
using Application.DTOs;
using Application.DTOs.Users;
using Application.Interfaces;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Persistence;

namespace Application.Services.Users;

public class UserService(
    AppDbContext dbContext,
    IOptions<AppDbSettings> settings,
    ServiceHelper<UserService> serviceHelper,
    IPhotoService photoService)
{
    private readonly IMongoCollection<User> _userCollection =
        dbContext.Database.GetCollection<User>(settings.Value.UsersCollectionName);

    private readonly ServiceHelper<UserService> _serviceHelper = serviceHelper;

    public async Task<Result<List<UserLikeDTO>>> GetUserByNameOrEmail(string? searchTerm)
    {
        return await _serviceHelper.ExecuteSafeAsync(async () =>
        {
            FilterDefinition<User> filter;

            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                filter = Builders<User>.Filter.Empty;
            }
            else
            {
                var regexFilter = new BsonRegularExpression(searchTerm, "i");

                filter = Builders<User>.Filter.Or(
                    Builders<User>.Filter.Regex(u => u.Email, regexFilter),
                    Builders<User>.Filter.Regex(u => u.Name, regexFilter)
                );
            }

            var users = await _userCollection.Find(filter).ToListAsync();

            var formattedUsers = users
                .Where(u => u != null) // defensa extra
                .Select(UserLikeDTO.FromEntity)
                .ToList();

            return Result<List<UserLikeDTO>>.Success(formattedUsers);
        });
    }

    public async Task<Result<UserLikeDTO>> Update(string id, UpdateUserDto updateUserDto)
    {
        return await _serviceHelper.ExecuteSafeAsync( async () => {
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var user = await _userCollection.Find(filter).FirstOrDefaultAsync();

            if (user == null) return Result<UserLikeDTO>.Failure("User does not exist", 400);

            if (updateUserDto.OldPublicId != "default")
            {
                await photoService.DeletePhoto(updateUserDto.OldPublicId);
            }

            var update = Builders<User>.Update
                .Set(u => u.Name, updateUserDto.Name)
                .Set(u => u.PictureId, updateUserDto.PictureId)
                .Set(u => u.PictureUrl, updateUserDto.PictureUrl);

            var updatedUser = await _userCollection.FindOneAndUpdateAsync(
                filter,
                update,
                new FindOneAndUpdateOptions<User>
                {
                    ReturnDocument = ReturnDocument.After
                }
            );

            return Result<UserLikeDTO>.Success(UserLikeDTO.FromEntity(updatedUser));
        });
    }
}
