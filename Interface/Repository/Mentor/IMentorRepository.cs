using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs;
using InterntManagementSystem.DTOs.Mentor;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.Interface.Repository.Mentor
{
    public interface IMentorRepository
    {
        Task<bool> LoginAsync(InternLogin mentorLogin);

        Task<List<InternListDto>> GetInternsByMentorIdAsync(int mentorId);

        Task<InternListDto?> GetInternByIdAsync(int internId);

        Task<List<InternTaskListDto>> GetTasksByInternIdAsync(int internId);

        Task<InternTaskCreateDto> CreateInternTaskAsync(InternTaskCreateDto taskCreateDto);

        Task<UpdateCreatedTaskDto?> UpdateInternTaskAsync(UpdateCreatedTaskDto updateTask);

        Task<bool> DeleteInternTaskAsync(int taskId);
    }
}