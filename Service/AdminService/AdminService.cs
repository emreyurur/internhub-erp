using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Interface.Repository.Admin;
using InterntManagementSystem.Interface.Service;
using BCrypt.Net;
using InterntManagementSystem.Mapping.AdminMapper;

namespace InterntManagementSystem.Service.CreateUserService
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<List<InternListDto>> GetAllInternsAsync()
        {
            return await _adminRepository.GetAllInternsAsync();
        }

        public async Task<List<MentorListDto>> GetAllMentorsAsync()
        {
            return await _adminRepository.GetAllMentorsAsync();
        }

        public async Task<CreateInternReturnDto> CreateInternAsync(CreateIntern dto)
        {
            var password = await GenerateRandomPasswordAsync(12);
            var HashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            dto.HashedPassword = HashedPassword;
            var (result, id) = await _adminRepository.CreateInternAsync(dto);
            var returnDto = AdminMapper.MapToCreateInternReturnDto(result, password);
            returnDto.Id = id;
            return returnDto;
        }

        public async Task<bool> DeleteInternAsync(int internId)
        {
            return await _adminRepository.DeleteInternAsync(internId);
        }

        public async Task<CreateMentorReturnDto> CreateMentorAsync(CreateMentor dto)
        {
            var password = await GenerateRandomPasswordAsync(12);
            var HashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            dto.HashedPassword = HashedPassword;
            var (result, id) = await _adminRepository.CreateMentorAsync(dto);
            var returnDto = AdminMapper.MapToCreateMentorReturnDto(result, password);
            returnDto.Id = id;
            return returnDto;
        }

        public async Task<bool> DeleteMentorAsync(int mentorId)
        {
            return await _adminRepository.DeleteMentorAsync(mentorId);
        }

        public async Task<string> GenerateRandomPasswordAsync(int length)
        {
            // Parola oluşturma işlemi burada yapılabilir
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var password = new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
            return await Task.FromResult(password);
        }

    }

}