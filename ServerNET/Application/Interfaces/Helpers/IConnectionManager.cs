using System;

namespace Application.Interfaces.Helpers;

public interface IConnectionManager
{
    void AddToChat(string chatId, string connectionId, string userId);
    void RemoveFromChat(string chatId, string connectionId);
    bool IsUserInChat(string chatId, string userId);
    IReadOnlyCollection<string> GetUsersInChat(string chatId);
}
