using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs;
using InterntManagementSystem.DTOs.Task;

namespace InterntManagementSystem.Interface.Repository.Task
{
    public interface IAssigmentRepository
    {

        Task<AssigmentDto> GetTaskByIdAsync(int taskId);

        Task<CreateAssigmentDto> CreateTaskAsync(CreateAssigmentDto taskCreateDto);

        Task<UpdateAssigmentDto> UpdateTaskAsync(UpdateAssigmentDto updateTask);

        Task<bool> DeleteTaskAsync(int taskId);

        Task<List<AssigmentDto>> GetAllTasksAsync();



    }
}