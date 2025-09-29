using System;
using Application.Core;
using Application.DTOs.Messages;
using Application.DTOs.Shared;
using Application.Interfaces.Core;
using Application.Interfaces.Messages;
using Application.Interfaces.Repositories;
using Domain;
using MongoDB.Driver;

namespace Application.Services.Messages;

public class MessageService(
    IMessagesRepository messagesRepository,
    IServiceHelper<IMessageService> serviceHelper) : IMessageService
{

    private readonly IServiceHelper<IMessageService> _serviceHelper = serviceHelper;
    private readonly IMessagesRepository _messagesRepository = messagesRepository;

    public async Task<List<Message>> GetAll()
    {
        return await _messagesRepository.GetAllAsync();
    }

    public async Task<Result<PaginatedMessagesDto>> GetMessagesByChatId(string chatId, PaginationDto paginationDto)
    {
        return await _serviceHelper.ExecuteSafeAsync( async () =>
        {
            int page = paginationDto.Page;
            int limit = paginationDto.Limit;

            var filter = Builders<Message>.Filter.Eq(m => m.Chat, chatId);

            var total = await _messagesRepository.CountByChatIdAsync(chatId);

            var messages = await _messagesRepository.GetByChatIdAsync(chatId, page, limit);

            messages.Reverse();

            var messagesDto = messages.Select(MessageDTO.FromEntity).ToList();

            var totalPages = (int)Math.Ceiling((double)total / limit);

            var result = new PaginatedMessagesDto
            {
                Page = page,
                Limit = limit,
                Total = total,
                TotalPages = totalPages,
                Next = (page * limit < total) ? $"/api/messages/{chatId}?page={page + 1}&limit={limit}" : null,
                Prev = (page > 1) ? $"/api/messages/{chatId}?page={page - 1}&limit={limit}" : null,
                Messages = messagesDto
            };
            return Result<PaginatedMessagesDto>.Success(result);
        });
    }

    public async Task<Result<object>> GetUnseenMessages(List<string> chatIds, string userId)
    {
        return await _serviceHelper.ExecuteSafeAsync(async () =>
        {
            var unseenMessages = await _messagesRepository.GetUnseenByChatIdsAsync(chatIds);

            var unseenMessagesByChat = unseenMessages
                .GroupBy(m => m.Chat)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(m => new UnseenMessageDto
                    {
                        Id = m.Id,
                        Sender = m.Sender,
                        Chat = m.Chat
                    }).ToList()
                );

            return Result<object>.Success(unseenMessagesByChat);
        });
    }

    public async Task<Result<Message>> Create(CreateMessageDto createMessageDto)
    {
        return await _serviceHelper.ExecuteSafeAsync(async () =>
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

            await _messagesRepository.InsertAsync(message);

            return Result<Message>.Success(message);
        });
    }


    public async Task<Result<bool>> UpdateMessageStatus(UpdateMessageDto updateMessageDto)
    {
        return await _serviceHelper.ExecuteSafeAsync<bool>( async () =>
        {
            var ids = updateMessageDto.MessageIds;

            if (ids.Length == 0 || ids[0] == "")
                return Result<bool>.Failure("Ids are empty", 400);            

            var modifiedCount = await _messagesRepository.UpdateStatusAsync(ids);

            if (modifiedCount == 0)
            {
                return Result<bool>.Failure("No messages were updated", 404);
            }

            return Result<bool>.Success(true);
        });
    }
}