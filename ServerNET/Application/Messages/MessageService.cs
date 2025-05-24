using System;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Persistence;

namespace Application.Messages;

public class MessageService(AppDbContext dbContext, IOptions<AppDbSettings> settings)
{
    private readonly IMongoCollection<Message> _messagesCollection = dbContext.Database.GetCollection<Message>(settings.Value.MessagesCollectionName);
    public async Task<List<Message>> GetAll()
    {
        return await _messagesCollection.Find(_ => true).ToListAsync();
    }
}
