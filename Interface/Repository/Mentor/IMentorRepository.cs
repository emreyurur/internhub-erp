using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs;
using InterntManagementSystem.DTOs.Mentor;
using InterntManagementSystem.Models;
using Microsoft.OpenApi.Any;

namespace InterntManagementSystem.Interface.Repository.Mentor
{
    public interface IMentorRepository
    {

        Task<bool> LoginAsync(InternLogin mentorLogin);

        //buraya bir dto yaz ve düzgün gelsin
        Task<List<Intern>> GetInternsByMentorIdAsync(int mentorId);


        //bu kısmı hallet
        Task<Intern?> GetInternByIdAsync(int internId);

        Task<List<InternTaskListDto>> GetTasksByInternIdAsync(int internId);



        Task<InternTaskCreateDto> CreateInternTaskAsync(InternTaskCreateDto taskCreateDto);

        Task<UpdateCreatedTaskDto?> UpdateInternTaskAsync(UpdateCreatedTaskDto updateTask);

        Task<bool> DeleteInternTaskAsync(int taskId);
    }
}