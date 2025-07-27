using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class RegisterUserDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Name is required")]
    [MinLength(3, ErrorMessage = "Name should have at least 3 characters")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password should have at least 6 characters")]
    public string Password { get; set; } = null!;

    public string? PictureUrl { get; set; } = "https://res.cloudinary.com/dluwqcce9/image/upload/v1694961227/InTouch/qqaarw68ruwwluvcphkh.jpg";
    public string? PictureId { get; set; } = "default";
}
