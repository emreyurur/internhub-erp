using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.Data;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Interface.Repository.Admin;
using InterntManagementSystem.Mapping.AdminMapper;

namespace InterntManagementSystem.Repository
{
    public class Admins : IAdminRepository
    {

        private readonly ApplicationDBContext _context;

        public Admins(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<CreateIntern> CreateInternAsync(CreateIntern dto)
        {
            var intern = AdminMapper.MapToInternModel(dto);
            await _context.Interns.AddAsync(intern);
            await _context.SaveChangesAsync();
            return dto;
        }


        

        public async Task<CreateMentor> CreateMentorAsync(CreateMentor dto)
        {
            var mentor = AdminMapper.MapToMentorModel(dto);

            await _context.Mentors.AddAsync(mentor);
            await _context.SaveChangesAsync();

            return dto;
        }

        public Task<bool> DeleteInternAsync(int internId)
        {
            var intern = _context.Interns.FirstOrDefault(i => i.Id == internId);
            if (intern == null)
            {
                return Task.FromResult(false);
            }

            _context.Interns.Remove(intern);
            return Task.FromResult(_context.SaveChanges() > 0);
        }

        public Task<bool> DeleteMentorAsync(int mentorId)
        {
            var mentor = _context.Mentors.FirstOrDefault(i => i.Id == mentorId);
            if (mentor == null)
            {
                return Task.FromResult(false);
            }

            _context.Mentors.Remove(mentor);
            return Task.FromResult(_context.SaveChanges() > 0);
        }
    }
}