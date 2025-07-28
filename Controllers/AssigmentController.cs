using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using InterntManagementSystem.DTOs.Task;
using InterntManagementSystem.Interface.Repository.Task;

namespace InterntManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssigmentController : ControllerBase
    {
        private readonly IAssigmentRepository _assigmentRepository;

        public AssigmentController(IAssigmentRepository assigmentRepository)
        {
            _assigmentRepository = assigmentRepository;
        }

        // GET: api/Assigment
        [HttpGet]
        public async Task<ActionResult<List<AssigmentDto>>> GetAllTasks()
        {
            var tasks = await _assigmentRepository.GetAllTasksAsync();
            return Ok(tasks);
        }

        // GET: api/Assigment/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AssigmentDto>> GetTaskById(int id)
        {
            var task = await _assigmentRepository.GetTaskByIdAsync(id);
            return Ok(task);
        }

        // POST: api/Assigment
        [HttpPost]
        public async Task<ActionResult<CreateAssigmentDto>> CreateTask([FromBody] CreateAssigmentDto dto)
        {
            var createdTask = await _assigmentRepository.CreateTaskAsync(dto);
            return Ok(createdTask);
        }

        // PATCH: api/Assigment
        [HttpPatch()]
        public async Task<ActionResult<UpdateAssigmentDto>> UpdateTask([FromBody] UpdateAssigmentDto dto)
        {


            var updatedTask = await _assigmentRepository.UpdateTaskAsync(dto);
            return Ok(updatedTask);
        }

        // DELETE: api/Assigment/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteTask(int id)
        {
            var result = await _assigmentRepository.DeleteTaskAsync(id);
            return Ok(result);
        }
    }
}