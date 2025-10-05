using System;
using Application.Core;
using Application.DTOs.Chats;
using Application.DTOs.Messages;
using Application.DTOs.Users;
using Application.Interfaces.Chats;
using Application.Interfaces.Core;
using Application.Interfaces.Messages;
using Application.Interfaces.Repositories;
using Application.Services.Chats;
using Application.Services.Messages;
using Application.Tests.Builders.Chats;
using Application.Tests.Builders.Users;
using AutoMapper;
using FluentAssertions;
using Moq;

namespace Application.Tests.Services.Chats;

public class ChatsServiceTests
{
    private readonly Mock<IServiceHelper<IChatService>> _mockChatsServiceHelper;
    private readonly Mock<IServiceHelper<IMessageService>> _mockMessageServiceHelper;
    private readonly Mock<IChatsRepository> _mockChatsRepository;
    private readonly Mock<IMessagesRepository> _mockMessagesRepository;
    private readonly Mock<IMapper> _mockMapper;
    private readonly ChatsService _chatsService;
    private readonly string UserId = "user-id";
    

    public ChatsServiceTests()
    {

        _mockChatsServiceHelper = new Mock<IServiceHelper<IChatService>>();
        _mockMessageServiceHelper = new Mock<IServiceHelper<IMessageService>>();
        _mockChatsRepository = new Mock<IChatsRepository>();
        _mockMessagesRepository = new Mock<IMessagesRepository>();
        _mockMapper = new Mock<IMapper>();

        var messageService = new MessageService(
            _mockMessagesRepository.Object,
            _mockMessageServiceHelper.Object
        );

        _chatsService = new ChatsService(
            _mockChatsRepository.Object,
            messageService,
            _mockChatsServiceHelper.Object,
            _mockMapper.Object
        );
    }

    [Fact]
    public async Task GetChatsByUserId_ReturnsSuccess()
    {
        // Arrange
        var mockUsers = new List<UserDTO>
        {
            new UserDtoBuilder()
                .WithName("Arturo")
                .WithEmail("arturo@example.com")
                .Build(),
            new UserDtoBuilder()
                .WithName("Otro")
                .WithEmail("otro@example.com")
                .Build()
        };

        var expectedChats = new List<ChatDTO>
        {
            new ChatDtoBuilder().WithUsers(mockUsers).Build()
        };

        var expectedUnseen = new Dictionary<string, List<UnseenMessageDto>>();

        _mockMessageServiceHelper
            .Setup(m => m.ExecuteSafeAsync(It.IsAny<Func<Task<Result<object>>>>()))
            .ReturnsAsync(Result<object>.Success(expectedUnseen));

        _mockChatsServiceHelper
            .Setup(s => s.ExecuteSafeAsync(It.IsAny<Func<Task<Result<object>>>>()))
            .ReturnsAsync(Result<object>.Success(expectedChats));

        // Act
        var result = await _chatsService.GetChatsByUserId(UserId);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeAssignableTo<List<ChatDTO>>();

        result.Value.Should().BeEquivalentTo(expectedChats);
    }
}
