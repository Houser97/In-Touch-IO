using System;
using System.Dynamic;
using Application.Core;
using Application.DTOs.Chats;
using Application.DTOs.Messages;
using Application.Interfaces.Chats;
using Application.Interfaces.Core;
using Application.Interfaces.Messages;
using Application.Interfaces.Repositories;
using AutoMapper;
using Domain;
using MongoDB.Driver;

namespace Application.Services.Chats;

public class ChatsService(
    IChatsRepository chatsRepository,
    IMessageService messageService,
    IServiceHelper<IChatService> serviceHelper,
    IMapper mapper
) : IChatService
{
    private readonly IMessageService _messageService = messageService;
    private readonly IChatsRepository _chatsRepository = chatsRepository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<ChatDTO>> GetById(string chatId, string userId)
    {
        return await serviceHelper.ExecuteSafeAsync(async () =>
        {
            var chatWithDetails = await _chatsRepository.GetByIdAsync(chatId);
            
            if (chatWithDetails == null)
                return Result<ChatDTO>.Failure("Chat not found", 404);

            var chatDto = _mapper.Map<ChatDTO>(chatWithDetails);

            var unseenMessagesResult = await _messageService.GetUnseenMessages([chatId], userId);
            var unseenMessagesMap = unseenMessagesResult.Value as Dictionary<string, List<UnseenMessageDto>>;
            var unseenMessages = unseenMessagesMap?.GetValueOrDefault(chatId) ?? [];

            chatDto.UnseenMessages = unseenMessages;

            return Result<ChatDTO>.Success(chatDto);
        });
    }

    public async Task<Result<object>> GetChatsByUserId(string userId)
    {
        return await serviceHelper.ExecuteSafeAsync(async () =>
        {
            var chats = await _chatsRepository.GetAllByUserId(userId);
            var chatIds = chats.Select(c => c.Id).ToList();

            var unseenMessagesResult = await _messageService.GetUnseenMessages([.. chatIds.Select(c => c.ToString())], userId);
            var unseenMessages = unseenMessagesResult.Value;

            return Result<object>.Success(new { chats, unseenMessages });
        });
    }

    public async Task<Result<ChatDTO>> CreateChat(CreateChatDto createChatDto, string userId)
    {
        return await serviceHelper.ExecuteSafeAsync(async () =>
        {
            var userIds = createChatDto.UserIds;

            var chatExists = await _chatsRepository.FindExistingChatAsync(userIds);

            if (chatExists != null)
                return Result<ChatDTO>.Failure("Chat already exists", 400);

            var newChat = new Chat
            {
                Users = userIds,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _chatsRepository.InsertAsync(newChat);

            return await GetById(newChat.Id!.ToString(), userId);
        });
    }

    public async Task<Result<ChatDTO>> UpdateChat(string id, string userId, UpdateChatDto updateChatDto)
    {
        return await serviceHelper.ExecuteSafeAsync(async () =>
        {


            var modifiedCount = await _chatsRepository.UpdateAsync(id, userId, updateChatDto);

            if (modifiedCount == 0)
                return Result<ChatDTO>.Failure("Chat not found", 404);

            return await GetById(id, userId);
        });
    }
}