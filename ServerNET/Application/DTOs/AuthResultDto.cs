using System;
using Domain;

namespace Application.DTOs;

public class AuthResultDto
{
    public bool Success { get; set; }
    public string? Token { get; set; }
    public string? Message { get; set; }
    public User? User { get; set; }
}
