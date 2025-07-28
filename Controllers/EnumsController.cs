using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using InterntManagementSystem.Interface.Repository.Enums;

namespace InterntManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnumsController : ControllerBase
    {
        private readonly IEnumsRepository _enumsRepository;

        public EnumsController(IEnumsRepository enumsRepository)
        {
            _enumsRepository = enumsRepository;
        }

        // GET: api/Enums/roles
        [HttpGet("roles")]
        public async Task<ActionResult<List<string>>> GetRoles()
        {
            var roles = await _enumsRepository.GetAllRolesAsync();
            return Ok(roles);
        }

        // GET: api/Enums/departments
        [HttpGet("departments")]
        public async Task<ActionResult<List<string>>> GetDepartments()
        {
            var departments = await _enumsRepository.GetAllDepartmentsAsync();
            return Ok(departments);
        }

        // GET: api/Enums/disciplines
        [HttpGet("disciplines")]
        public async Task<ActionResult<List<string>>> GetDisciplines()
        {
            var disciplines = await _enumsRepository.GetAllDisciplinesAsync();
            return Ok(disciplines);
        }
    }
}