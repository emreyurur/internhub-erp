using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs;
using InterntManagementSystem.DTOs.Mentor;
using InterntManagementSystem.DTOs.User;

namespace InterntManagementSystem.Interface.Repository.Admin
{
    public interface IAdminRepository
    {
        Task<CreateIntern> CreateInternAsync(CreateIntern dto);
        Task<bool> DeleteInternAsync(int internId);

        Task<CreateMentor> CreateMentorAsync(CreateMentor dto);
        Task<bool> DeleteMentorAsync(int mentorId);
    }
}