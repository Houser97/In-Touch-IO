using System;

namespace Application.DTOs.Chats;

public class CreateChatDto(List<string> userIds)
{
    public List<string> UserIds { get; set; } = userIds;
}
