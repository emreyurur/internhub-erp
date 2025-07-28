using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterntManagementSystem.Interface.Repository.Enums
{
    public interface IEnumsRepository
    {
        public Task<List<string>> GetAllRolesAsync();

        public Task<List<string>> GetAllDepartmentsAsync();

       public Task<List<string>> GetAllDisciplinesAsync();

    }
}