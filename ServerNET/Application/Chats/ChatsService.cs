using System;
using System.Dynamic;
using Application.Core;
using Application.DTOs;
using Application.DTOs.Chats;
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

            var unseenMessagesResult = await _messageService.GetUnseenMessages([chatId], userId);
            var unseenMessagesMap = unseenMessagesResult.Value as Dictionary<string, List<UnseenMessageDTO>>;
            var unseenMessages = unseenMessagesMap?.GetValueOrDefault(chatId) ?? new List<UnseenMessageDTO>();

            // Aplanar: Combina propiedades del DTO con unseenMessages
            var chatDto = ChatDTO.FromBson(chat);

            dynamic result = new ExpandoObject();
            var resultDict = (IDictionary<string, object>)result;

            foreach (var prop in chatDto.GetType().GetProperties())
            {
                var camelCaseName = char.ToLowerInvariant(prop.Name[0]) + prop.Name[1..];
                resultDict[camelCaseName] = prop.GetValue(chatDto)!;
            }

            result.unseenMessages = unseenMessages;

            return Result<object>.Success(result);
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

            var chatIds = chats.Select(c => c.Id).ToList();

            var unseenMessages = await _messageService.GetUnseenMessages(chatIds, userId);

            return Result<object>.Success(new { chats, unseenMessages });

        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Internal server error: {ex.Message}", 500);
        }
    }

    public async Task<Result<object>> CreateChat(CreateChatDto createChatDto, string userId)
    {
        var userIds = createChatDto.UserIds;

        var filter = Builders<Chat>.Filter.And(
            Builders<Chat>.Filter.All(c => c.Users, userIds),
            Builders<Chat>.Filter.Size(c => c.Users, userIds.Count)
        );

        var chatExists = await _chatsCollection.Find(filter).FirstOrDefaultAsync();

        if (chatExists != null)
            return Result<object>.Failure("Chat already exists", 400);

        try
        {
            var newChat = new Chat
            {
                Users = userIds,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _chatsCollection.InsertOneAsync(newChat);

            return await GetById(newChat.Id!.ToString(), userId);
        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Internal server error: {ex.Message}", 500);
        }
    }

    public async Task<Result<object>> UpdateChat(string id, string userId, UpdateChatDto updateChatDto)
    {
        try
        {
            var filter = Builders<Chat>.Filter.Eq(c => c.Id, id);
            var update = Builders<Chat>.Update.Set(c => c.LastMessage, updateChatDto.LastMessage);

            var result = await _chatsCollection.UpdateOneAsync(filter, update);

            if (result.ModifiedCount == 0)
                return Result<object>.Failure("Chat not found", 404);

            return await GetById(id, userId);
        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Internal server error: {ex.Message}", 500);
        }
    }
}