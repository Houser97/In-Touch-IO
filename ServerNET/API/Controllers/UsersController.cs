using Application.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(UserService userService) : ControllerBase
    {
        private readonly UserService _userService = userService;

        [HttpGet()]
        [AllowAnonymous]
        public async Task<ActionResult> GetByNameOrEmail([FromQuery] string? search)
        {
            var result = await _userService.GetUserByNameOrEmail(search);

            if (!result.IsSuccess) return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }
    }
}
