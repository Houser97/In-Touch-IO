namespace Application.DTOs.Messages;

public class CreateMessageDto
{
    public string Sender { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string Chat { get; set; } = null!;
    public string Image { get; set; } = null!;
    public bool IsSeen { get; set; }
}

