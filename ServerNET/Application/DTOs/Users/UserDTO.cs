using System;
using Domain;
using MongoDB.Bson;

namespace Application.DTOs.Users;

public class UserDTO
{

}


public class UserLikeDTO(string id, string name, string email, string pictureUrl, string pictureId)
{
    public string? Id { get; set; } = id;
    public string Name { get; set; } = name;
    public string Email { get; set; } = email;
    public string PictureUrl { get; set; } = pictureUrl;
    public string PictureId { get; set; } = pictureId;

    public static UserLikeDTO FromBson(BsonDocument doc)
    {
        var id = doc.GetValue("_id", "").ToString();
        var name = doc.GetValue("name", "").AsString;
        var email = doc.GetValue("email", "").AsString;
        var pictureUrl = doc.GetValue("pictureUrl", "").AsString;
        var pictureId = doc.GetValue("pictureId", "").AsString;

        return new UserLikeDTO(id!, name, email, pictureUrl, pictureId);
    }

    public static UserLikeDTO FromEntity(User user)
    {
        return new UserLikeDTO(
            user.Id!,
            user.Name,
            user.Email,
            user.PictureUrl,
            user.PictureId
        );
    }
}