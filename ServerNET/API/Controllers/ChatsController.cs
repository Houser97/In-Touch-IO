using Application.Chats;
using Domain;
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
        public async Task<ActionResult<Chat>> GetById(string id)
        {
            var result = await _chatsService.GetById(id);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }
    }
}
