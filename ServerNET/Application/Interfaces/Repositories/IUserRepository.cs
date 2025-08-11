using System;
using Domain;

namespace Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetById(string userId);
    Task InsertUserAsync(User user);
}
