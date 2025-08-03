using Application.DTOs;
using Application.DTOs.Messages;
using Application.Interfaces;
using Application.Services.Messages;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController(IMessageService messageService) : ControllerBase
    {
        private readonly IMessageService _messageService = messageService;

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

        [HttpPut]
        public async Task<ActionResult<bool>> UpdateMessageStatus(UpdateMessageDto updateMessageDto)
        {
            var result = await _messageService.UpdateMessageStatus(updateMessageDto);

            if (!result.IsSuccess)
                return StatusCode(result.Code, new { message = result.Error });

            return Ok(true);

        }
    }
}
