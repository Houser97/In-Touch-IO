using System.Security.Claims;
using Application.Auth;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AuthService authService) : ControllerBase
    {

        private readonly AuthService _authService = authService;

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginUserDto)
        {
            var result = await _authService.Login(loginUserDto);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new
            {
                user = result.User,
                token = result.Token
            });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            var result = await _authService.Register(registerUserDto);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new
            {
                user = result.User,
                token = result.Token
            });
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetStatus()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var AuthResultDto = await _authService.GetAuthenticatedUser(userId);

            if (!AuthResultDto.Success)
            {
                return Unauthorized();
            }

            return Ok(new
            {
                user = AuthResultDto.User
            });
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            return Ok(new { userId, email });
        }
    }
}