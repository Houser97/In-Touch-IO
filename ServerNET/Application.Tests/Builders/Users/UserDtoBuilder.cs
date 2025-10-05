using System;
using Application.DTOs.Chats;
using Application.DTOs.Users;

namespace Application.Tests.Builders.Users;

public class UserDtoBuilder
{
    private string _id = Guid.NewGuid().ToString();
    private string _name = Guid.NewGuid().ToString();
    private string _email = Guid.NewGuid().ToString();
    private string _pictureUrl = Guid.NewGuid().ToString();
    private string _pictureId = Guid.NewGuid().ToString();

    public UserDtoBuilder WithId(string id)
    {
        _id = id;
        return this;
    }

    public UserDtoBuilder WithName(string name)
    {
        _name = name;
        return this;
    }

    public UserDtoBuilder WithEmail(string email)
    {
        _email = email;
        return this;
    }

    public UserDtoBuilder WithPictureUrl(string pictureUrl)
    {
        _pictureUrl = pictureUrl;
        return this;
    }

    public UserDtoBuilder WithPictureId(string pictureId)
    {
        _pictureId = pictureId;
        return this;
    }

    public UserDTO Build()
    {
        return new UserDTO
        {
            Id = _id,
            Name = _name,
            Email = _email,
            PictureId = _pictureId,
            PictureUrl = _pictureUrl
        };
    }
}
