using Application.DTOs.Users;
using Application.Interfaces.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpGet()]
        [AllowAnonymous]
        public async Task<ActionResult> GetByNameOrEmail([FromQuery] string? search)
        {
            var result = await _userService.GetUserByNameOrEmail(search);

            if (!result.IsSuccess) return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }

        [HttpPut("{userId}")]
        public async Task<ActionResult> Update(string userId, UpdateUserDto updateUserDto)
        {
            var result = await _userService.Update(userId, updateUserDto);

            if (!result.IsSuccess) return StatusCode(result.Code, new { message = result.Error });

            return Ok(result.Value);
        }
    }
}
