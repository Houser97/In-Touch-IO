using System;

namespace Application.DTOs.Users;

public class UpdateUserDto(
    string name,
    string pictureId,
    string pictureUrl
)
{
    public string Name { get; set; } = name;
    public string PictureId { get; set; } = pictureId;
    public string PictureUrl { get; set; } = pictureUrl;
}
