using Microsoft.AspNetCore.SignalR;
using Application.DTOs.Messages;
using Application.DTOs.Chats;
using Application.Interfaces.Messages;
using Application.Interfaces.Chats;
using Application.Interfaces.Helpers;

namespace API.SignalR;

public class ChatHub(
    IMessageService messageService,
    IChatService chatService,
    IConnectionManager connectionManager
) : Hub
{

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        foreach (var chatId in connectionManager.GetUsersInChat(Context.ConnectionId))
        {
            connectionManager.RemoveFromChat(chatId, Context.ConnectionId);
        }
        return base.OnDisconnectedAsync(exception);
    }

    public async Task Setup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        Console.WriteLine($"User {userId} joined their personal group.");
    }

    public async Task JoinChat(string chatId, string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
        connectionManager.AddToChat(chatId, Context.ConnectionId, userId);
        Console.WriteLine($"Joined chat {chatId}");
    }

    public async Task LeaveChat(string chatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId);
        connectionManager.RemoveFromChat(chatId, Context.ConnectionId);
        Console.WriteLine($"Left chat {chatId}");
    }

    private async Task NotifyChatUsers(ChatDTO chat, object payload)
    {
        foreach (var user in chat.Users)
        {
            await Clients.Group(user.Id!).SendAsync("personal-message-chat", payload);
        }
    }

    public async Task PersonalMessage(PersonalMessagePayload payload)
    {
        try
        {
            var chat = payload.Chat;
            var createMessageDto = payload.Message;

            var sender = createMessageDto.Sender;
            var friendId = chat.Users.First(u => u.Id != createMessageDto.Sender).Id;

            if (friendId != null && connectionManager.IsUserInChat(chat.Id, friendId))
            {
                createMessageDto.IsSeen = true;
            }

            var messageResult = await messageService.Create(createMessageDto!);

            var updateChatDto = new UpdateChatDto(messageResult.Value!.Id!);

            await chatService.UpdateChat(chat.Id!.ToString(), sender, updateChatDto!);

            var updatedChat = await chatService.GetById(chat.Id.ToString(), friendId.ToString()!);

            var chatPayload = (dynamic)updatedChat.Value;

            foreach (var user in chat.Users)
            {
                await Clients.Group(user.Id.ToString()!).SendAsync("personal-message-chat", new
                {
                    chat = chatPayload,
                    unseenMessages = chatPayload.UnseenMessages
                });
            }

            await Clients.Group(chat.Id.ToString()).SendAsync("personal-message-local", messageResult.Value);

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            await Clients.Group(payload.Message.Sender.ToString())
                .SendAsync("personal-message", ex.Message);
        }
    }
}


public class PersonalMessagePayload
{
    public required ChatDTO Chat { get; set; }
    public required CreateMessageDto Message { get; set; }
}

public class ChatPayloadDto
{
    public ChatDTO Chat { get; set; } = default!;
    public int UnseenMessages { get; set; }
}