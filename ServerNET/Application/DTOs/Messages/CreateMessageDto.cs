namespace Application.DTOs.Messages;

public record CreateMessageDto(
    string Sender,
    string Content,
    string Chat,
    string Image,
    bool IsSeen
)
{
    public static (string? Error, CreateMessageDto? Dto) Create(
        string sender,
        string content,
        string chat,
        string image,
        bool? isSeen = null
    )
    {
        if (string.IsNullOrWhiteSpace(sender))
            return ("Sender is required.", null);

        if (string.IsNullOrWhiteSpace(content) && string.IsNullOrWhiteSpace(image))
            return ("Either content or image must be provided.", null);

        if (string.IsNullOrWhiteSpace(chat))
            return ("Chat ID is required.", null);

        return (null, new CreateMessageDto(
            Sender: sender.Trim(),
            Content: content.Trim(),
            Chat: chat.Trim(),
            Image: image?.Trim() ?? string.Empty,
            IsSeen: isSeen ?? false
        ));
    }


}
