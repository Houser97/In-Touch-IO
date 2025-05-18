using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("_id")]
    public string? Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("sender")]
    public string Sender { get; set; } = null!;

    [BsonElement("content")]
    public string Content { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("chat")]
    public string Chat { get; set; } = null!;

    [BsonElement("isSeen")]
    public bool IsSeen { get; set; }

    [BsonElement("image")]
    public string? Image { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; }

    [BsonElement("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}
