using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.Interface.Repository
{
    public interface IUserRepository
    {



        //bunu da yaparız
        Task<List<InternTaskListDto>> GetAllTasksByUserIdAsync(int userId);


        Task<InternTaskDto> GetTaskByIdAsync(int taskId);



        Task<InternProfileDto> GetInternByIdAsync(int internId);

        Task<InternTaskListDto> UpdateTaskAsync(UpdateTask updateTask);

        //buraya da bakman lazım
        //halloldu
        Task<Intern> LoginAsync(InternLogin userLogin);
    }
}