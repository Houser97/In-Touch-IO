using System;
using Application.Core;
using Application.DTOs;
using Application.Messages;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Persistence;

namespace Application.Chats;

public class ChatsService(AppDbContext dbContext, IOptions<AppDbSettings> settings, MessageService messageService)
{
    private readonly IMongoCollection<Chat> _chatsCollection = dbContext.Database.GetCollection<Chat>(settings.Value.ChatsCollectionName);
    private readonly IMongoCollection<User> _usersCollection = dbContext.Database.GetCollection<User>(settings.Value.UsersCollectionName);
    private readonly IMongoCollection<Message> _messagesCollection = dbContext.Database.GetCollection<Message>(settings.Value.MessagesCollectionName);
    private readonly MessageService _messageService = messageService;

    public async Task<Result<object>> GetById(string chatId, string userId)
    {
        try
        {
            var pipeline = new[]
            {
                new BsonDocument("$match", new BsonDocument("_id", new ObjectId(chatId))),
                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "users" },
                    { "localField", "users" },
                    { "foreignField", "_id" },
                    { "as", "users" }
                }),
                new BsonDocument("$lookup", new BsonDocument
                {
                    {"from", "messages"},
                    {"localField", "lastMessage"},
                    {"foreignField", "_id"},
                    {"as", "lastMessage"}
                }),
                new BsonDocument("$unwind", new BsonDocument
                {
                    {"path", "$lastMessage"},
                    {"preserveNullAndEmptyArrays", true}
                })
            };

            var chat = await _chatsCollection.Aggregate<BsonDocument>(pipeline).FirstOrDefaultAsync();
            if (chat == null)
                return Result<object>.Failure("Chat not found", 404);

            var unseenMessages = await _messageService.GetUnseenMessages([chatId], userId);

            var chatDto = new
            {
                chat = ChatDTO.FromBson(chat),
                unseenMessages = unseenMessages
            };

            return Result<object>.Success(chatDto);
        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Internal Server Error: {ex.Message}", 500);
        }
    }

    public async Task<Result<object>> GetChatsByUserId(string userId)
    {
        try
        {
            var userObjectId = new ObjectId(userId);

            var pipeline = new[]
            {
                new BsonDocument("$match", new BsonDocument("users", userObjectId)),
                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "users" },
                    { "localField", "users" },
                    { "foreignField", "_id" },
                    { "as", "users" }
                }),
                new BsonDocument("$lookup", new BsonDocument
                {
                    { "from", "messages" },
                    { "localField", "lastMessage" },
                    { "foreignField", "_id" },
                    { "as", "lastMessage" }
                }),

                new BsonDocument("$unwind", new BsonDocument
                {
                    { "path", "$lastMessage" },
                    { "preserveNullAndEmptyArrays", true }
                }),

                new BsonDocument("$sort", new BsonDocument("updatedAt", -1))
            };

            var bsonChats = await _chatsCollection
                .Aggregate<BsonDocument>(pipeline)
                .ToListAsync();

            var chats = bsonChats
                .Select(ChatDTO.FromBson)
                .ToList();

            return Result<object>.Success(new { chats });

        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Internal server error: {ex.Message}", 500);
        }
    }
}