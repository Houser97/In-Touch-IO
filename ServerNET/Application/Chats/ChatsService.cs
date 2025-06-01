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
    private readonly IMongoCollection<User> _usersCollection = dbContext.Database.GetCollection<User>(settings.Value.UsersCollectionName);
    private readonly IMongoCollection<Message> _messagesCollection = dbContext.Database.GetCollection<Message>(settings.Value.MessagesCollectionName);

    public async Task<Result<object>> GetById(string chatId)
    {
        try
        {
            var chat = await _chatsCollection.Find(c => c.Id == chatId).FirstOrDefaultAsync();
            if (chat == null)
                return Result<object>.Failure("Chat not found", 404);

            var userObjectIds = chat.Users.Select(id => id).ToList();
            var users = await _usersCollection
                .Find(u => userObjectIds.Contains(u.Id!))
                .Project(u => new { u.Id, u.Name, u.Email, u.PictureUrl, u.PictureId })
                .ToListAsync();

            object? lastMessage = null;
            if (!string.IsNullOrEmpty(chat.LastMessage))
            {
                lastMessage = await _messagesCollection
                    .Find(m => m.Id == chat.LastMessage)
                    .FirstOrDefaultAsync();
            }

            var unseenMessages = await GetUnseenMessages(chatId);

            var chatDto = new
            {
                Chat = chat,
                Users = users,
                LastMessage = lastMessage,
                UnseenMessages = unseenMessages
            };

            return Result<object>.Success(chatDto);
        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Internal Server Error: {ex.Message}", 500);
        }
    }

    private async Task<List<Message>> GetUnseenMessages(string chatId)
    {
        // Aquí puedes poner tu lógica real para obtener mensajes no vistos
        return await _messagesCollection
            .Find(m => m.Chat == chatId)
            .ToListAsync();
    }
}