using Application.Chats;
using Application.Messages;
using Microsoft.AspNetCore.SignalR;
using Application.DTOs.Messages;
using Application.DTOs.Chats;
using Domain;
using Application.DTOs;
using System.Text.Json;

namespace API.SignalR;

public class ChatHub(
    MessageService messageService,
    ChatsService chatService
) : Hub
{
    public async Task Setup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        Console.WriteLine($"User {userId} joined their personal group.");
    }

    public async Task JoinChat(string chatId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, chatId);
        Console.WriteLine($"Joined chat {chatId}");
    }

    public async Task LeaveChat(string chatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatId);
        Console.WriteLine($"Left chat {chatId}");
    }

    public async Task PersonalMessage(PersonalMessagePayload payload)
    {
        Console.WriteLine(payload);
        try
        {
            var json = JsonSerializer.Serialize(payload); // convértelo a JSON string
            var deserializedPayload = JsonSerializer.Deserialize<PersonalMessagePayload>(json); // deserialízalo como DTO

            if (deserializedPayload == null) throw new Exception("Payload inválido");

            var chat = deserializedPayload.Chat;
            var messageData = deserializedPayload.Message;

            string sender = messageData.Sender;
            string content = messageData.Content;
            string image = messageData.Image;
            bool? isSeen = messageData.IsSeen;

            var (error, createMessageDto) = CreateMessageDto.Create(sender, content, chat.Id!, image, isSeen);
            if (error != null)
            {
                await Clients.Group(messageData.Sender.ToString())
                    .SendAsync("personal-message-chat", error);
                return;
            }

            // Suponiendo que puedes obtener las conexiones activas por grupo de alguna forma
            // Aquí se omite ese detalle por ser más complejo en SignalR nativamente
            //createMessageDto.IsSeen = true; // Asume que el otro está conectado

            var messageResult = await messageService.Create(createMessageDto!);
            Console.WriteLine(messageResult.Value);

            var updateChatDto = new UpdateChatDto(messageResult.Value!.Id!);

            await chatService.UpdateChat(chat.Id!.ToString(), sender, updateChatDto!);

            // Supongamos que tu método `GetById` necesita el ID del otro usuario
            var friendId = chat.Users.First(u => u.Id != messageResult.Value.Sender);
            var updatedChat = await chatService.GetById(chat.Id.ToString(), friendId.ToString()!);

            var chatPayload = (dynamic)updatedChat.Value;

            foreach (var user in chat.Users)
            {
                await Clients.Group(user.Id.ToString()!).SendAsync("personal-message-chat", new
                {
                    chat = chatPayload,
                    unseenMessages = chatPayload.unseenMessages
                });
            }

            await Clients.Group(chat.Id.ToString()).SendAsync("personal-message-local",  messageResult.Value );

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            await Clients.Group(payload.Message.Sender.ToString())
                .SendAsync("personal-message", ex.Message);
        }
    }
}

public class UserDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PictureUrl { get; set; }
    public string PictureId { get; set; }
}

public class ChatDto
{
    public string Id { get; set; }
    public List<UserDto> Users { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<MessageDto> UnseenMessages { get; set; }
}

public class MessageDto
{
    public string Sender { get; set; }
    public string Content { get; set; }
    public string Chat { get; set; }
    public string Image { get; set; }
    public bool? IsSeen { get; set; }
}


public class PersonalMessagePayload
{
    public ChatDto Chat { get; set; }
    public MessageDto Message { get; set; }
}