using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using InterntManagementSystem.Repository.Mentors;
using InterntManagementSystem.DTOs.Mentor;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Models;
using InterntManagementSystem.Interface.Repository.Mentor;
using InterntManagementSystem.DTOs;

namespace InterntManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MentorController : ControllerBase
    {
        private readonly IMentorRepository _mentorRepository;

        public MentorController(IMentorRepository mentorRepository)
        {
            _mentorRepository = mentorRepository;
        }

        // POST: api/Mentor/CreateInternTask
        [HttpPost("CreateInternTask")]
        public async Task<ActionResult<InternTaskCreateDto>> CreateInternTask([FromBody] InternTaskCreateDto dto)
        {
            var result = await _mentorRepository.CreateInternTaskAsync(dto);
            return Ok(result);
        }

        // DELETE: api/Mentor/DeleteInternTask/{taskId}
        [HttpDelete("DeleteInternTask/{taskId}")]
        public async Task<ActionResult<bool>> DeleteInternTask(int taskId)
        {
            var result = await _mentorRepository.DeleteInternTaskAsync(taskId);
            return Ok(result);
        }

        // GET: api/Mentor/intern/{internId}
        [HttpGet("intern/{internId}")]
        public async Task<ActionResult<InternListDto>> GetInternById(int internId)
        {
            var intern = await _mentorRepository.GetInternByIdAsync(internId);
            if (intern == null)
                return NotFound();
            return Ok(intern);
        }

        // GET: api/Mentor/interns/{mentorId}
        [HttpGet("interns/{mentorId}")]
        public async Task<ActionResult<List<InternListDto>>> GetInternsByMentorId(int mentorId)
        {
            var interns = await _mentorRepository.GetInternsByMentorIdAsync(mentorId);
            return Ok(interns);
        }

        // GET: api/Mentor/InternTasks/{internId}
        [HttpGet("InternTasks/{internId}")]
        public async Task<ActionResult<List<InternTaskListDto>>> GetTasksByInternId(int internId)
        {
            var tasks = await _mentorRepository.GetTasksByInternIdAsync(internId);
            return Ok(tasks);
        }

        // POST: api/Mentor/login
        [HttpPost("login")]
        public async Task<ActionResult<bool>> Login([FromBody] InternLogin loginDto)
        {
            var result = await _mentorRepository.LoginAsync(loginDto);
            return Ok(result);
        }

        // PUT: api/Mentor/InternTask
        [HttpPatch("UpdateInternTask")]
        public async Task<ActionResult<UpdateCreatedTaskDto?>> UpdateInternTask([FromBody] UpdateCreatedTaskDto updateTask)
        {
            var result = await _mentorRepository.UpdateInternTaskAsync(updateTask);
            return Ok(result);
        }
    }
}