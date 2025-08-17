using System;
using Application.DTOs.Chats;
using Domain;

namespace Application.Interfaces.Repositories;

public interface IChatsRepository
{
    Task<ChatDTO?> GetByIdAsync(string chatId);
    Task<List<ChatDTO>> GetAllByUserId(string userId);
    Task InsertAsync(Chat chat);
    Task<long> UpdateAsync(string chatId, string userId, UpdateChatDto updateChatDto);
    Task<Chat?> FindExistingChatAsync(List<string> userIds);

}
