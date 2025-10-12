using System;
using Application.DTOs.Chats;
using Application.DTOs.Messages;
using Application.DTOs.Users;

namespace Application.Tests.Builders.Chats;

public class ChatDtoBuilder
{
    private string _id = Guid.NewGuid().ToString();
    private List<UserDTO> _users = [];
    private LastMessageDto _lastMessage = default!;
    private DateTime _updatedAt = DateTime.UtcNow;

    public ChatDtoBuilder WithId(string id)
    {
        _id = id;
        return this;
    }

    public ChatDtoBuilder WithUsers(List<UserDTO> users)
    {
        _users = users;
        return this;
    }

    public ChatDtoBuilder WithLastMessageDto(LastMessageDto lastMessageDto)
    {
        _lastMessage = lastMessageDto;
        return this;
    }

    public ChatDtoBuilder WithUpdatedAt(DateTime updatedAt)
    {
        _updatedAt = updatedAt;
        return this;
    }

    public ChatDTO Build()
    {
        return new ChatDTO
        {
            Id = _id,
            Users = _users,
            LastMessage = _lastMessage,
            UpdatedAt = _updatedAt
        };
    }
}
