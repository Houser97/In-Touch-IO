using System;
using Application.Core;
using Application.DTOs.Messages;
using Application.Interfaces.Core;
using Application.Interfaces.Messages;
using Application.Interfaces.Repositories;
using Application.Services.Messages;
using Application.Tests.Builders.Messages;
using Application.Tests.Extensions;
using Domain;
using FluentAssertions;
using Moq;

namespace Application.Tests.Services.Messages
{
    public class MessageServiceTests
    {
        private readonly Mock<IServiceHelper<IMessageService>> _mockServiceHelper;
        private readonly Mock<IMessagesRepository> _mockMessagesRepository;
        private readonly MessageService _messageService;
        private readonly string UserId = "user-id";

        public MessageServiceTests()
        {
            _mockServiceHelper = new Mock<IServiceHelper<IMessageService>>();
            _mockMessagesRepository = new Mock<IMessagesRepository>();

            _mockServiceHelper.SetupExecuteSafe<IMessageService, Message>();

            _messageService = new MessageService(
                _mockMessagesRepository.Object,
                _mockServiceHelper.Object
            );
        }

        [Fact]
        public async Task Create_ShouldReturnSuccess_WhenDtoIsValid()
        {
            // Arrange - CreateMessageDto
            var createMessageDto = new CreateMessageDtoBuilder()
                .WithSender(UserId)
                .Build();

            // Arrange - Expected Result (Message)
            var insertedMessage = (Message?)null;

            _mockMessagesRepository
                .Setup(x => x.InsertAsync(It.IsAny<Message>()))
                .Callback<Message>(m => insertedMessage = m)
                .Returns(Task.CompletedTask);


            // Act
            var result = await _messageService.Create(createMessageDto);

            // Assert
            result.IsSuccess.Should().BeTrue();
            result.Value.Should().NotBeNull();
            result.Value.Should().BeSameAs(insertedMessage);

            insertedMessage.Should().NotBeNull();

            _mockMessagesRepository.Verify(x => x.InsertAsync(It.IsAny<Message>()), Times.Once);
        }
    }
}
