using System;
using Application.Interfaces.Helpers;

namespace Application.Helpers;

public class ConnectionManager : IConnectionManager
{
    private readonly Dictionary<string, HashSet<(string ConnectionId, string UserId)>> _chatConnections = new();

    public void AddToChat(string chatId, string connectionId, string userId)
    {
        if (!_chatConnections.ContainsKey(chatId))
            _chatConnections[chatId] = new HashSet<(string, string)>();

        _chatConnections[chatId].Add((connectionId, userId));
    }

    public void RemoveFromChat(string chatId, string connectionId)
    {
        if (_chatConnections.ContainsKey(chatId))
        {
            _chatConnections[chatId].RemoveWhere(x => x.ConnectionId == connectionId);
            if (_chatConnections[chatId].Count == 0)
                _chatConnections.Remove(chatId);
        }
    }

    public bool IsUserInChat(string chatId, string userId)
    {
        return _chatConnections.ContainsKey(chatId) &&
               _chatConnections[chatId].Any(x => x.UserId == userId);
    }

    public IReadOnlyCollection<string> GetUsersInChat(string chatId)
    {
        return _chatConnections.ContainsKey(chatId)
            ? _chatConnections[chatId].Select(x => x.UserId).ToList()
            : [];
    }
}
