using System;
using MongoDB.Bson;

namespace Application.DTOs;

public class MessageDTO(string id, string sender, string content, string chat, bool isSeen, string image, DateTime createdAt)
{
    public string Id { get; set; } = id;
    public string Sender { get; set; } = sender;
    public string Content { get; set; } = content;
    public string Chat { get; set; } = chat;
    public bool IsSeen { get; set; } = isSeen;
    public string Image { get; set; } = image;
    public DateTime CreatedAt { get; set; } = createdAt;

    public static MessageDTO FromDictionary(Dictionary<string, string> dict)
    {
        if (!dict.TryGetValue("_id", out var idObj))
            throw new ArgumentException("Missing _id from object");

        if (!dict.TryGetValue("sender", out var senderOjb))
            throw new ArgumentException("Missing sender from object");

        if (!dict.TryGetValue("content", out var contentObj))
            throw new ArgumentException("Missing content from object");

        if (!dict.TryGetValue("chat", out var chatObj))
            throw new ArgumentException("Missing chat from object");

        if (!dict.TryGetValue("isSeen", out var isSeenObj))
            throw new ArgumentException("Missing isSeen from object");

        if (!dict.TryGetValue("image", out var imageObj))
            throw new ArgumentException("Missing content from object");

        if (!dict.TryGetValue("createdAt", out var createdAtObj))
            throw new ArgumentException("Missing createdAt from object");

        return new MessageDTO(idObj.ToString(), senderOjb.ToString(), contentObj.ToString(), chatObj.ToString(), Convert.ToBoolean(isSeenObj.ToString()), imageObj.ToString(), DateTime.Parse(createdAtObj.ToString()!));
    }
    
    public static MessageDTO FromBson(BsonDocument doc)
    {
        var id = doc.GetValue("_id", "").ToString();
        var sender = doc.GetValue("sender", "").ToString();
        var content = doc.GetValue("content", "").AsString;
        var chat = doc.GetValue("chat", "").ToString();
        var isSeen = doc.GetValue("isSeen", false).ToBoolean();
        var image = doc.GetValue("image", "").AsString;
        var createdAt = doc.GetValue("createdAt", BsonNull.Value).ToUniversalTime();

        return new MessageDTO(id!, sender!, content, chat!, isSeen, image, createdAt);
    }
}
