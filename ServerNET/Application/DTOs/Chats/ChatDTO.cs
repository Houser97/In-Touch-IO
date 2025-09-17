using Application.DTOs.Messages;
using Application.DTOs.Users;

namespace Application.DTOs.Chats;

public class ChatDTO
{
    public string Id { get; set; } = string.Empty;
    public List<UserDTO> Users { get; set; } = [];
    public LastMessageDto? LastMessage { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<UnseenMessageDto> UnseenMessages { get; set; } = [];
}
