using System;
using Application.DTOs.Messages;
using Domain;

namespace Application.Interfaces.Repositories;

public interface IMessagesRepository
{
    Task<List<Message>> GetAllAsync();
    Task<List<Message>> GetByChatIdAsync(string chatId, int page, int limit);
    Task<long> CountByChatIdAsync(string chatId);
    Task InsertAsync(Message message);
    Task<long> UpdateStatusAsync(IEnumerable<string> messageIds);
    Task<List<UnseenMessageDto>> GetUnseenByChatIdsAsync(IEnumerable<string> chatIds);
    Task<Message?> GetByIdAsync(string messageId);
}
