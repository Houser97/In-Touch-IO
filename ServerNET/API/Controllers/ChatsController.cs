using System.Security.Claims;
using Application.Services.Chats;
using Application.Core;
using Application.DTOs.Chats;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Interfaces;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatsController(IChatService chatsService) : ControllerBase
    {
        private readonly IChatService _chatsService = chatsService;

        [HttpGet("{id}")]
        public async Task<ActionResult<Chat>> GetById(string id)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _chatsService.GetById(id, userId);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }

        [HttpGet]
        public async Task<ActionResult<Chat[]>> GetChatsByUserId()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _chatsService.GetChatsByUserId(userId);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }

        [HttpPost]
        public async Task<ActionResult<Chat>> CreateChat(CreateChatDto createChatDto)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _chatsService.CreateChat(createChatDto, userId);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Chat>> UpdateChat(string id, UpdateChatDto updateChatDto)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _chatsService.UpdateChat(id, userId, updateChatDto);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }
    }
}
