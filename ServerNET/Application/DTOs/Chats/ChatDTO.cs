using System;
using System.Collections.Generic;
using System.Linq;
using MongoDB.Bson;

namespace Application.DTOs;

public class ChatDTO(string id, List<UserLikeDTO> users, object lastMessage, DateTime updatedAt)
{
    public string Id { get; set; } = id;
    public List<UserLikeDTO> Users { get; set; } = users;
    public object LastMessage { get; set; } = lastMessage;
    public DateTime UpdatedAt { get; set; } = updatedAt;

    public static ChatDTO FromBson(BsonDocument doc)
    {
        if (!doc.Contains("_id")) throw new ArgumentException("Missing _id from object");
        if (!doc.Contains("users")) throw new ArgumentException("Missing users from object");
        if (!doc.Contains("updatedAt")) throw new ArgumentException("Missing updatedAt from object");

        var id = doc["_id"].ToString();

        var usersArray = doc["users"].AsBsonArray;
        var users = usersArray
            .Select(userDoc => UserLikeDTO.FromBson(userDoc.AsBsonDocument))
            .ToList();

        object lastMessage = null!;

        if (doc.Contains("lastMessage"))
        {
            var lastMessageRaw = doc["lastMessage"];
            if (lastMessageRaw.IsBsonDocument)
            {
                lastMessage = MessageDTO.FromBson(lastMessageRaw.AsBsonDocument);
            }
            else
            {
                lastMessage = lastMessageRaw?.ToString() ?? string.Empty;
            }
        }

        var updatedAt = doc["updatedAt"].ToUniversalTime();

        return new ChatDTO(id!, users, lastMessage, updatedAt);
    }
}
