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

        // GET: api/User/tasks/{userId}
        [HttpGet("GetAllTaskByUserId/{userId}")]
        public async Task<ActionResult<List<Assignment>>> GetAllTasksByUserId(int userId)
        {
            var tasks = await _userRepository.GetAllTasksByUserIdAsync(userId);
            return Ok(tasks);
        }

        // GET: api/User/intern/{internId}
        [HttpGet("intern/{internId}")]
        public async Task<ActionResult<Intern>> GetInternById(int internId)
        {
            var intern = await _userRepository.GetInternByIdAsync(internId);
            return Ok(intern);
        }

        // GET: api/User/task/{taskId}
        [HttpGet("TaskById/{taskId}")]
        public async Task<ActionResult<Assignment>> GetTaskById(int taskId)
        {
            var task = await _userRepository.GetTaskByIdAsync(taskId);
            return Ok(task);
        }

        // GET: api/User/{id}
        [HttpGet("GetInternById/{id}")]
        public async Task<ActionResult<Models.User>> GetUserById(int id)
        {
            var user = await _userRepository.GetInternByIdAsync(id);
            return Ok(user);
        }

        // POST: api/User/complete-task
        [HttpPatch("complete-task")]
        public async Task<ActionResult<InternTaskDto>> CompleteTask([FromBody] UpdateTask updateTask)
        {
            var task = await _userRepository.UpdateTaskAsync(updateTask);
            return Ok(task);
        }
    }
}