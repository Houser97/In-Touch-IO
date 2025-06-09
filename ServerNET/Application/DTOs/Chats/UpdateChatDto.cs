using System;

namespace Application.DTOs.Chats;

public class UpdateChatDto(string lastMessage)
{
    public string LastMessage { get; set; } = lastMessage;
}
