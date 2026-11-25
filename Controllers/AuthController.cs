using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InterntManagementSystem.Data;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public AuthController(ApplicationDBContext context)
        {
            _context = context;
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.HashedPassword))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            if (user.IsFirstLogin)
            {
                user.IsFirstLogin = false;
                await _context.SaveChangesAsync();
            }

            Discipline? discipline = null;
            int? mentorId = null;

            if (user is Intern intern)
            {
                discipline = intern.Discipline;
                mentorId = intern.MentorId;
            }
            else if (user is Mentor mentor)
            {
                discipline = mentor.Discipline;
            }

            return Ok(new LoginResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Lastname = user.Lastname,
                Email = user.Email,
                Department = user.Department,
                Role = user.Role,
                Discipline = discipline,
                MentorId = mentorId
            });
        }
    }
}

