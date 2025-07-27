using System;

namespace Application.DTOs.Messages;

public class PaginatedMessagesDto
{
    public int Page { get; set; }
    public int Limit { get; set; }
    public long Total { get; set; }
    public int TotalPages { get; set; }
    public string? Next { get; set; }
    public string? Prev { get; set; }
    public List<MessageDTO> Messages { get; set; } = [];
}
