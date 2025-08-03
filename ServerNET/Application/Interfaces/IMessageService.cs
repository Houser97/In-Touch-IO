using System;
using Application.Core;
using Application.DTOs;
using Application.DTOs.Messages;
using Domain;

namespace Application.Interfaces;

public interface IMessageService
{
    Task<List<Message>> GetAll();
    Task<Result<PaginatedMessagesDto>> GetMessagesByChatId(string chatId, PaginationDto paginationDto);
    Task<Result<object>> GetUnseenMessages(List<string> chatIds, string userId);
    Task<Result<Message>> Create(CreateMessageDto createMessageDto);
    Task<Result<bool>> UpdateMessageStatus(UpdateMessageDto updateMessageDto);
}
