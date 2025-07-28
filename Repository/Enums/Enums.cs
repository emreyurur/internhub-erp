using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.Data;
using InterntManagementSystem.Interface.Repository.Enums;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.Repository.Enums
{
    public class Enums : IEnumsRepository
    {

        public  Task<List<string>> GetAllRolesAsync()
        {
            return Task.FromResult(new List<string>
            {
                "Admin",
                "Mentor",
                "Intern"
            });
            
        }

        public  Task<List<string>> GetAllDepartmentsAsync()
        {
            return Task.FromResult(new List<string>
            {
                "HR",
                "Engineering",
                "Marketing"
            });
        }

        public  Task<List<string>> GetAllDisciplinesAsync()
        {
            return Task.FromResult(new List<string>
            {
                "Ios",
                "Android",
                "Backend",
                "Frontend",
                "BusinessAnalyst"
            });
        }
    }
}