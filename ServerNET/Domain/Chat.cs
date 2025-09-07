using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain;

public class Chat
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("_id")]
    public string Id { get; set; } = string.Empty;
    [BsonElement("users")]
    [BsonRepresentation(BsonType.ObjectId)]
    public required List<string> Users { get; set; }
    [BsonElement("lastMessage")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? LastMessage { get; set; }
    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }
    [BsonElement("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}
