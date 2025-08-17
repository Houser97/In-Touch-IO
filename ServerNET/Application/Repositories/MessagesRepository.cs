using System;
using Application.DTOs.Messages;
using Application.Interfaces.Repositories;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Persistence;
using Persistence.Interfaces;

namespace Application.Repositories;

public class MessagesRepository(
    IAppDbContext dbContext,
    IOptions<AppDbSettings> settings
) : IMessagesRepository
{

    private readonly IMongoCollection<Message> _messagesCollection =
        dbContext.Database.GetCollection<Message>(settings.Value.MessagesCollectionName);

    public async Task<long> CountByChatIdAsync(string chatId)
    {
        return await _messagesCollection.CountDocumentsAsync(message => message.Chat == chatId);
    }

    public async Task<List<Message>> GetAllAsync()
    {
        return await _messagesCollection.Find(_ => true).ToListAsync();
    }

    public async Task<List<Message>> GetByChatIdAsync(string chatId, int page, int limit)
    {
        return await _messagesCollection
                .Find(message => message.Chat == chatId)
                .SortByDescending(message => message.CreatedAt)
                .Skip((page - 1) * limit)
                .Limit(limit)
                .ToListAsync();
    }

    public async Task<Message?> GetByIdAsync(string messageId)
    {
        return await _messagesCollection.Find(message => message.Id == messageId).FirstOrDefaultAsync();
    }

    public async Task<List<UnseenMessageDto>> GetUnseenByChatIdsAsync(IEnumerable<string> chatIds)
    {
        var filter = Builders<Message>.Filter.And(
            Builders<Message>.Filter.Eq(m => m.IsSeen, false),
            Builders<Message>.Filter.In(m => m.Chat, chatIds)
        );

        var projection = Builders<Message>.Projection
            .Expression(m => new UnseenMessageDto
            {
                Id = m.Id!,
                Sender = m.Sender,
                Chat = m.Chat
            });

        return await _messagesCollection
            .Find(filter)
            .Project(projection)
            .ToListAsync();
    }

    public async Task InsertAsync(Message message)
    {
        await _messagesCollection.InsertOneAsync(message);
    }

    public async Task<long> UpdateStatusAsync(IEnumerable<string> messageIds)
    {
        var filter = Builders<Message>.Filter.In(m => m.Id, messageIds);
        var update = Builders<Message>.Update.Set(m => m.IsSeen, true);

        return (await _messagesCollection.UpdateManyAsync(filter, update)).ModifiedCount;
    }
}
