using System;
using Application.Core;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Persistence;

namespace Application.Chats;

public class ChatsService(AppDbContext dbContext, IOptions<AppDbSettings> settings)
{
    private readonly IMongoCollection<Chat> _chatsCollection = dbContext.Database.GetCollection<Chat>(settings.Value.ChatsCollectionName);

    public async Task<Result<Chat>> GetById(string chatId)
    {
        try
        {
            var chat = await _chatsCollection.Find(c => c.Id == chatId).FirstOrDefaultAsync();
            if (chat == null) return Result<Chat>.Failure("Chat not found", 404);
            
            return Result<Chat>.Success(chat);
        }
        catch (Exception ex)
        {
            return Result<Chat>.Failure($"Internal server error: {ex.Message}", 500);
        }
    }
}
