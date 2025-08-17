using System;
using Application.DTOs.Chats;
using Application.Interfaces.Repositories;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Persistence;
using Persistence.Interfaces;

namespace Application.Repositories;

public class ChatsRepository(
    IAppDbContext dbContext,
    IOptions<AppDbSettings> settings
) : IChatsRepository
{

    private readonly IMongoCollection<Chat> _chatsCollection =
        dbContext.Database.GetCollection<Chat>(settings.Value.ChatsCollectionName);

    public async Task<Chat?> FindExistingChatAsync(List<string> userIds)
    {
        var filter = Builders<Chat>.Filter.And(
            Builders<Chat>.Filter.All(c => c.Users, userIds),
            Builders<Chat>.Filter.Size(c => c.Users, userIds.Count)
        );

        return await _chatsCollection.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<List<ChatDTO>> GetAllByUserId(string userId)
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

        return chats;
    }

    public async Task<ChatDTO?> GetByIdAsync(string chatId)
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
            { "from", "messages" },
            { "localField", "lastMessage" },
            { "foreignField", "_id" },
            { "as", "lastMessage" }
        }),
        new BsonDocument("$unwind", new BsonDocument
        {
            { "path", "$lastMessage" },
            { "preserveNullAndEmptyArrays", true }
        })
    };

        var chatDoc = await _chatsCollection
            .Aggregate<BsonDocument>(pipeline)
            .FirstOrDefaultAsync();

        if (chatDoc == null)
            return null;

        return ChatDTO.FromBson(chatDoc);
    }

    public async Task InsertAsync(Chat chat)
    {
        await _chatsCollection.InsertOneAsync(chat);
    }

    public async Task<long> UpdateAsync(string chatId, string userId, UpdateChatDto updateChatDto)
    {
        var filter = Builders<Chat>.Filter.Eq(c => c.Id, chatId);
        var update = Builders<Chat>.Update.Set(c => c.LastMessage, updateChatDto.LastMessage);

        return (await _chatsCollection.UpdateOneAsync(filter, update)).ModifiedCount;
    }
}
