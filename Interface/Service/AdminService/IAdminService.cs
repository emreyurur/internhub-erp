using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs.User;

namespace InterntManagementSystem.Interface.Service
{
    public interface IAdminService
    {
        Task<List<InternListDto>> GetAllInternsAsync();
        Task<List<MentorListDto>> GetAllMentorsAsync();
        Task<CreateInternReturnDto> CreateInternAsync(CreateIntern dto);
        Task<bool> DeleteInternAsync(int internId);

        Task<CreateMentorReturnDto> CreateMentorAsync(CreateMentor dto);
        Task<bool> DeleteMentorAsync(int mentorId);

        Task<string> GenerateRandomPasswordAsync(int length);
    }
}