using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using InterntManagementSystem.Repository.Users;
using InterntManagementSystem.Models;
using System.Collections.Generic;
using InterntManagementSystem.Interface.Repository;
using InterntManagementSystem.DTOs;

namespace InterntManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // GET: api/User/GetAllTaskByUserId/{userId}
        [HttpGet("GetAllTaskByUserId/{userId}")]
        public async Task<ActionResult<List<InternTaskListDto>>> GetAllTasksByUserId(int userId)
        {
            var tasks = await _userRepository.GetAllTasksByUserIdAsync(userId);
            return Ok(tasks);
        }

        // GET: api/User/intern/{internId}
        [HttpGet("intern/{internId}")]
        public async Task<ActionResult<InternProfileDto>> GetInternById(int internId)
        {
            try
            {
                var intern = await _userRepository.GetInternByIdAsync(internId);
                return Ok(intern);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // GET: api/User/TaskById/{taskId}
        [HttpGet("TaskById/{taskId}")]
        public async Task<ActionResult<InternTaskDto>> GetTaskById(int taskId)
        {
            try
            {
                var task = await _userRepository.GetTaskByIdAsync(taskId);
                return Ok(task);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // GET: api/User/GetInternById/{id}
        [HttpGet("GetInternById/{id}")]
        public async Task<ActionResult<InternProfileDto>> GetUserById(int id)
        {
            try
            {
                var user = await _userRepository.GetInternByIdAsync(id);
                return Ok(user);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // PATCH: api/User/complete-task
        [HttpPatch("complete-task")]
        public async Task<ActionResult<InternTaskListDto>> CompleteTask([FromBody] UpdateTask updateTask)
        {
            try
            {
                var task = await _userRepository.UpdateTaskAsync(updateTask);
                return Ok(task);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}