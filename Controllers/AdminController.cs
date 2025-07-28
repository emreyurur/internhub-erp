using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using InterntManagementSystem.Interface.Repository.Admin;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Interface.Service;

namespace InterntManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {

        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // POST: api/Admin/CreateIntern
        [HttpPost("CreateIntern")]
        public async Task<ActionResult<CreateIntern>> CreateIntern([FromBody] CreateIntern dto)
        {
            if(dto.Role != Models.Role.Intern)
            {
                return BadRequest("Role must be Intern.");
            }
            var result = await _adminService.CreateInternAsync(dto);
            return Ok(result);
        }

        // POST: api/Admin/CreateMentor
        [HttpPost("CreateMentor")]
        public async Task<ActionResult<CreateMentor>> CreateMentor([FromBody] CreateMentor dto)
        {
            if(dto.Role != Models.Role.Mentor)
            {
                return BadRequest("Role must be Mentor.");
            }
            var result = await _adminService.CreateMentorAsync(dto);
            return Ok(result);
        }

        // DELETE: api/Admin/DeleteIntern/{internId}
        [HttpDelete("DeleteIntern/{internId}")]
        public async Task<ActionResult<bool>> DeleteIntern(int internId)
        {
            var result = await _adminService.DeleteInternAsync(internId);
            if (!result)
                return NotFound();
            return Ok(result);
        }

        // DELETE: api/Admin/DeleteMentor/{mentorId}
        [HttpDelete("DeleteMentor/{mentorId}")]
        public async Task<ActionResult<bool>> DeleteMentor(int mentorId)
        {
            var result = await _adminService.DeleteMentorAsync(mentorId);
            if (!result)
                return NotFound();
            return Ok(result);
        }
    }
}