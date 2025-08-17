using System;
using Domain;

namespace Application.DTOs.Auth;

public class AuthResultDto
{
    public string? Token { get; set; }
    public User? User { get; set; }
}
