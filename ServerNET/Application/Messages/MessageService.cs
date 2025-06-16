using System;
using Application.Core;
using Application.DTOs;
using Application.DTOs.Messages;
using Domain;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
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

    public async Task<Result<object>> GetMessagesByChatId(string chatId, PaginationDto paginationDto)
    {
        try
        {
            int page = paginationDto.Page;
            int limit = paginationDto.Limit;

            var filter = Builders<Message>.Filter.Eq(m => m.Chat, chatId);

            var total = await _messagesCollection.CountDocumentsAsync(filter);

            var messages = await _messagesCollection
                .Find(filter)
                .SortByDescending(m => m.CreatedAt)
                .Skip((page - 1) * limit)
                .Limit(limit)
                .ToListAsync();

            messages.Reverse();

            var messagesDto = messages.Select(MessageDTO.FromEntity).ToList();

            var totalPages = (int)Math.Ceiling((double)total / limit);

            var result = new
            {
                page,
                limit,
                total,
                totalPages,
                next = (page * limit < total) ? $"/api/messages/{chatId}?page={page + 1}&limit={limit}" : null,
                prev = (page > 1) ? $"/api/messages/{chatId}?page={page - 1}&limit={limit}" : null,
                messages = messagesDto
            };
            return Result<object>.Success(result);

        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Internal server error {ex.Message}", 500);
        }
    }

    public async Task<Result<object>> GetUnseenMessages(List<string> chatIds, string userId)
    {
        try
        {
            var filter = Builders<Message>.Filter.And(
                Builders<Message>.Filter.Eq(m => m.IsSeen, false),
                Builders<Message>.Filter.In(m => m.Chat, chatIds)
            // Builders<Message>.Filter.Ne(m => m.Sender, userId)
            );

            var projection = Builders<Message>.Projection
                .Include(m => m.Id)
                .Include(m => m.Sender)
                .Include(m => m.Chat);

            var bsonMessages = await _messagesCollection
                .Find(filter)
                .Project<BsonDocument>(projection)
                .ToListAsync();

            var unseenMessagesByChat = new Dictionary<string, List<UnseenMessageDTO>>();

            foreach (var doc in bsonMessages)
            {
                var chatId = doc["chat"].AsObjectId.ToString();
                var message = new UnseenMessageDTO
                {
                    Id = doc["_id"].AsObjectId.ToString(),
                    Sender = doc["sender"].AsObjectId.ToString()
                };

                if (!unseenMessagesByChat.ContainsKey(chatId))
                    unseenMessagesByChat[chatId] = [];

                unseenMessagesByChat[chatId].Add(message);
            }

            return Result<object>.Success(unseenMessagesByChat);
        }
        catch (Exception ex)
        {
            return Result<object>.Failure($"Internal server error: {ex.Message}", 500);
        }
    }

    public async Task<Result<Message>> Create(CreateMessageDto createMessageDto)
    {
        try
        {
            var message = new Message
            {
                Chat = createMessageDto.Chat,
                Content = createMessageDto.Content,
                Image = createMessageDto.Image,
                IsSeen = createMessageDto.IsSeen,
                Sender = createMessageDto.Sender,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _messagesCollection.InsertOneAsync(message);

            return Result<Message>.Success(await _messagesCollection.Find(m => m.Id == message.Id).FirstOrDefaultAsync());
        }
        catch (Exception ex)
        {
            return Result<Message>.Failure($"Internal server error: {ex.Message}", 500);
        }
    }
}
