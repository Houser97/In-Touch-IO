using System;
using Application.Aggregates;
using Application.DTOs.Chats;
using Application.DTOs.Messages;
using Application.DTOs.Users;
using Application.Interfaces.Repositories;
using Domain;
using Microsoft.Extensions.Options;
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

    private readonly IMongoCollection<User> _usersCollection =
        dbContext.Database.GetCollection<User>(settings.Value.UsersCollectionName);

    private readonly IMongoCollection<Message> _messagesCollection =
        dbContext.Database.GetCollection<Message>(settings.Value.MessagesCollectionName);

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
        var chats = await _chatsCollection.Aggregate()
        .Match(chat => chat.Users.Contains(userId))
        .SortByDescending(chat => chat.UpdatedAt)
        .Lookup<Chat, User, ChatWithDetails>(
            _usersCollection,
            chat => chat.Users,
            user => user.Id,
            chat => chat.UsersWithDetails
        )
        .Lookup<ChatWithDetails, Message, ChatWithDetails>(
            _messagesCollection,
            chat => chat.LastMessage,
            msg => msg.Id,
            chat => chat.LastMessageWithDetails
        )
        .Unwind(chat => chat.LastMessageWithDetails, new AggregateUnwindOptions<ChatWithDetails>
        {
            PreserveNullAndEmptyArrays = true
        })
            .Project(chat => new ChatDTO
            {
                Id = chat.Id,
                Users = chat.UsersWithDetails.Select(u => new UserDTO
                {
                    Id = u.Id.ToString(),
                    Name = u.Email,
                    Email = u.Email,
                    PictureUrl = u.PictureUrl,
                    PictureId = u.PictureId
                }).ToList(),
                LastMessage = chat.LastMessageWithDetails == null ? null : new LastMessageDto
                {
                    Id = chat.LastMessageWithDetails.Id.ToString(),
                    Sender = chat.LastMessageWithDetails.Sender,
                    Content = chat.LastMessageWithDetails.Content
                },
                UpdatedAt = (DateTime)chat.UpdatedAt
            })
        .ToListAsync();

        foreach (var user in chats)
        {
            Console.WriteLine(user.Id);
            foreach (var user2 in user.Id)
            {
                Console.WriteLine(user2);
            }
                
            Console.WriteLine(user.LastMessage);
        }

        Console.WriteLine(chats);
        return chats;
    }

    public async Task<ChatWithDetails?> GetByIdAsync(string chatId)
    {
        return await _chatsCollection.Aggregate()
        .Match(chat => chat.Id == chatId)
        .SortByDescending(chat => chat.UpdatedAt)
        .Lookup<Chat, User, ChatWithDetails>(
            _usersCollection,
            chat => chat.Users,
            user => user.Id,
            chatWithDetails => chatWithDetails.UsersWithDetails
        )
        .Lookup<ChatWithDetails, Message, ChatWithDetails>(
            _messagesCollection,
            chat => chat.LastMessage,
            msg => msg.Id,
            chatWithDetails => chatWithDetails.LastMessageWithDetails
        )
        .Unwind(chat => chat.LastMessageWithDetails, new AggregateUnwindOptions<ChatWithDetails>
        {
            PreserveNullAndEmptyArrays = true
        })
        .FirstOrDefaultAsync();
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
