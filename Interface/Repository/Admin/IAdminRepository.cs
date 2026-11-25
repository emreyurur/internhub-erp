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
        Task<List<InternListDto>> GetAllInternsAsync();
        Task<List<MentorListDto>> GetAllMentorsAsync();
        Task<(CreateIntern Dto, int Id)> CreateInternAsync(CreateIntern dto);
        Task<bool> DeleteInternAsync(int internId);

        Task<(CreateMentor Dto, int Id)> CreateMentorAsync(CreateMentor dto);
        Task<bool> DeleteMentorAsync(int mentorId);
    }
}