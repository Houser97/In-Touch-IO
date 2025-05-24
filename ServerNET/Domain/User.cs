using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("_id")]
    public string? Id { get; set; }
    [BsonElement("email")]
    public string Email { get; set; } = null!;
    [BsonElement("name")]
    public string Name { get; set; } = null!;
    [BsonElement("password")]
    public string Password { get; set; } = null!;
    [BsonElement("pictureUrl")]
    public string PictureUrl { get; set; } = null!;
    [BsonElement("pictureId")]
    public string PictureId { get; set; } = null!;
}
