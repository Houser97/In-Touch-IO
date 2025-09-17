using System;
using Domain;

namespace Application.Aggregates;

public class ChatWithDetails : Chat
{
    public required List<User> UsersWithDetails { get; set; }
    public Message? LastMessageWithDetails { get; set; }

}
