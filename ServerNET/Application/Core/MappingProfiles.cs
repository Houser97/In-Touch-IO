using System;
using Application.Aggregates;
using Application.DTOs.Chats;
using Application.DTOs.Messages;
using Application.DTOs.Users;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // Se indica la fuente del mapeo y hacia donde se mapea.
        CreateMap<User, UserDTO>();
        CreateMap<Message, LastMessageDto>();
        CreateMap<ChatWithDetails, ChatDTO>()
            .ForMember(dest => dest.Users, opt => opt.MapFrom(src => src.UsersWithDetails))
            .ForMember(dest => dest.LastMessage, opt => opt.MapFrom(src => src.LastMessageWithDetails))
            .ForMember(dest => dest.UnseenMessages, opt => opt.Ignore());
    }
}