using System;
using Domain;

namespace Application.Interfaces.Core;

public interface ITokenGenerator
{
    string GenerateToken(User user);
}
