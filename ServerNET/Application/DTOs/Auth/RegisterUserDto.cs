using System;

namespace Application.DTOs.Auth;

public class RegisterUserDto : BaseAuthDto
{
    public string Name { get; set; } = null!;
    public string? PictureUrl { get; set; } = "https://res.cloudinary.com/dluwqcce9/image/upload/v1694961227/InTouch/qqaarw68ruwwluvcphkh.jpg";
    public string? PictureId { get; set; } = "default";
}
