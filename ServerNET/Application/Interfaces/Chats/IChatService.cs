using System;
using Application.Core;
using Application.DTOs.Chats;

namespace Application.Interfaces.Chats;

public interface IChatService
{
    Task<Result<object>> GetById(string chatId, string userId);
    Task<Result<object>> GetChatsByUserId(string userId);
    Task<Result<object>> CreateChat(CreateChatDto createChatDto, string userId);
    Task<Result<object>> UpdateChat(string id, string userId, UpdateChatDto updateChatDto);
}
