using System;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class LoginUserDto
{
    private string _email = null!;

    [Required(ErrorMessage = "Email is required")]
    [MinLength(3, ErrorMessage = "Email should have at least 3 characters")]
    public string Email
    {
        get => _email;
        set => _email = value.ToLowerInvariant();
    }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password should have at least 6 characters")]
    public string Password { get; set; } = null!;
}

