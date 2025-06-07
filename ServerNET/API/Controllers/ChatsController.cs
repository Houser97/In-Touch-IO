using System.Security.Claims;
using Application.Chats;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatsController(ChatsService chatsService) : ControllerBase
    {
        private readonly ChatsService _chatsService = chatsService;

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Chat>> GetById(string id)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _chatsService.GetById(id, userId);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<Chat[]>> GetChatsByUserId()
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var result = await _chatsService.GetChatsByUserId(userId);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }
    }
}
