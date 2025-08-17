using System;

namespace Application.Interfaces.Security;

public interface IUserAccessor
{
    string? GetUserId();
    string? GetUsername();
    string? GetEmail();
}
