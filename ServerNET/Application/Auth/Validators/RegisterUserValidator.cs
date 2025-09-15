using System;
using Application.DTOs.Auth;
using FluentValidation;

namespace Application.Auth.Validators;

public class RegisterUserValidator : BaseAuthValidator<RegisterUserDto>
{
    public RegisterUserValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name must not be empty")
            .MinimumLength(3).WithMessage("Name should have at least 3 letters");
    }
}
