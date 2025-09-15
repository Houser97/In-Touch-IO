using System;

namespace Application.DTOs.Messages;

public class UnseenMessageDto
{
    public required string Id { get; set; }
    public required string Sender { get; set; }
    public required string Chat { get; set; }
}
