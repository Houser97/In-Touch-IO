using Application.DTOs;
using Application.Messages;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController(MessageService messageService) : ControllerBase
    {
        private readonly MessageService _messageService = messageService;

        [HttpGet]
        public async Task<ActionResult<List<Message>>> GetAllMessages()
        {
            return await _messageService.GetAll();
        }

        [HttpGet("{chatId}")]
        public async Task<ActionResult<List<Message>>> GetChatMessages(
            string chatId,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10
        )
        {
            var paginationDto = new PaginationDto(page, limit);

            var result = await _messageService.GetMessagesByChatId(chatId, paginationDto);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }
    }
}
