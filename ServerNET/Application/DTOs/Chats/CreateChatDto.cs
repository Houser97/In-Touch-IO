using System;
using System.Text.Json.Serialization;

namespace Application.DTOs.Chats;

public class CreateChatDto
{
    [JsonPropertyName("users")]
    public List<string> UserIds { get; set; } = [];
}
