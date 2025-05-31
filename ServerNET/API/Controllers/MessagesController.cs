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
        [Authorize]
        public async Task<ActionResult<List<Message>>> GetAllMessages()
        {
            return await _messageService.GetAll();
        }
    }
}
