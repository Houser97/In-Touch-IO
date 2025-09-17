using System;
using Application.Core;
using Application.DTOs.Chats;

namespace Application.Interfaces.Chats;

public interface IChatService
{
    Task<Result<ChatDTO>> GetById(string chatId, string userId);
    Task<Result<object>> GetChatsByUserId(string userId);
    Task<Result<ChatDTO>> CreateChat(CreateChatDto createChatDto, string userId);
    Task<Result<ChatDTO>> UpdateChat(string id, string userId, UpdateChatDto updateChatDto);
}
