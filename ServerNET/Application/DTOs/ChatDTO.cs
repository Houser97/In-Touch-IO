using System;
using Domain;
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
        if (!doc.Contains("_id")) throw new ArgumentException("Missing _id");
        if (!doc.Contains("users")) throw new ArgumentException("Missing users");
        if (!doc.Contains("lastMessage")) throw new ArgumentException("Missing lastMessage");
        if (!doc.Contains("updatedAt")) throw new ArgumentException("Missing updatedAt");

        var id = doc["_id"].ToString();

        var usersArray = doc["users"].AsBsonArray;
        var users = usersArray
            .Select(u => UserLikeDTO.FromBson(u.AsBsonDocument))
            .ToList();

        object lastMessage;
        var lastMessageRaw = doc["lastMessage"];
        if (lastMessageRaw.IsBsonDocument)
        {
            lastMessage = MessageDTO.FromBson(lastMessageRaw.AsBsonDocument);
        }
        else
        {
            lastMessage = lastMessageRaw.ToString()!; // en caso de que sea un string u otro tipo
        }

        var updatedAt = doc["updatedAt"].ToUniversalTime();

        return new ChatDTO(id!, users, lastMessage, updatedAt);
    }
}
