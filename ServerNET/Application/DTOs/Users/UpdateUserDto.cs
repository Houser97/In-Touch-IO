using System;

namespace Application.DTOs.Users;

public class UpdateUserDto(
    string name,
    string pictureId,
    string pictureUrl,
    string oldPublicId
)
{
    public string Name { get; set; } = name;
    public string PictureId { get; set; } = pictureId;
    public string PictureUrl { get; set; } = pictureUrl;
    public string OldPublicId { get; set; } = oldPublicId;
}
