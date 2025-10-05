using System;
using Application.DTOs.Messages;

namespace Application.Tests.Builders.Messages;

public class CreateMessageDtoBuilder
{
    private string _sender = Guid.NewGuid().ToString();
    private string _content = "Generic content";
    private string _chat = Guid.NewGuid().ToString();
    private string _image = "Generic image";
    private bool _isSeen = false;

    public CreateMessageDtoBuilder WithSender(string sender)
    {
        _sender = sender;
        return this;
    }

    public CreateMessageDtoBuilder WithContent(string content)
    {
        _content = content;
        return this;
    }

    public CreateMessageDtoBuilder WithChat(string chat)
    {
        _chat = chat;
        return this;
    }

    public CreateMessageDtoBuilder WithImage(string image)
    {
        _image = image;
        return this;
    }

    public CreateMessageDtoBuilder WithIsSeen(bool isSeen)
    {
        _isSeen = isSeen;
        return this;
    }

    public CreateMessageDto Build()
    {
        return new CreateMessageDto
        {
            Sender = _sender,
            Content = _content,
            Chat = _chat,
            Image = _image,
            IsSeen = _isSeen
        };
    } 
}
