using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.Data;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Interface.Repository.Admin;
using InterntManagementSystem.Mapping.AdminMapper;
using Microsoft.EntityFrameworkCore;

namespace InterntManagementSystem.Repository
{
    public class Admins : IAdminRepository
    {
        private readonly ApplicationDBContext _context;

        public Admins(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<InternListDto>> GetAllInternsAsync()
        {
            return await _context.Interns
                .Include(i => i.Mentor)
                .Select(i => new InternListDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Lastname = i.Lastname,
                    Email = i.Email,
                    Department = i.Department,
                    Discipline = i.Discipline,
                    Phone = i.Phone,
                    University = i.University,
                    MentorId = i.MentorId,
                    MentorName = i.Mentor != null ? $"{i.Mentor.Name} {i.Mentor.Lastname}" : null,
                    CreatedAt = i.CreatedAt,
                    EndDate = i.EndDate,
                    Role = i.Role
                })
                .ToListAsync();
        }

        public async Task<List<MentorListDto>> GetAllMentorsAsync()
        {
            return await _context.Mentors
                .Include(m => m.Interns)
                .Select(m => new MentorListDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Lastname = m.Lastname,
                    Email = m.Email,
                    Department = m.Department,
                    Discipline = m.Discipline,
                    InternCount = m.Interns.Count,
                    Role = m.Role
                })
                .ToListAsync();
        }

        public async Task<(CreateIntern Dto, int Id)> CreateInternAsync(CreateIntern dto)
        {
            var intern = AdminMapper.MapToInternModel(dto);
            await _context.Interns.AddAsync(intern);
            await _context.SaveChangesAsync();
            return (dto, intern.Id);
        }

        public async Task<(CreateMentor Dto, int Id)> CreateMentorAsync(CreateMentor dto)
        {
            var mentor = AdminMapper.MapToMentorModel(dto);
            await _context.Mentors.AddAsync(mentor);
            await _context.SaveChangesAsync();
            return (dto, mentor.Id);
        }

        public async Task<bool> DeleteInternAsync(int internId)
        {
            var intern = await _context.Interns.FirstOrDefaultAsync(i => i.Id == internId);
            if (intern == null)
            {
                return false;
            }

            var tasks = await _context.InternTasks.Where(t => t.AssignedToId == internId).ToListAsync();
            if (tasks.Count > 0)
            {
                _context.InternTasks.RemoveRange(tasks);
            }

            _context.Interns.Remove(intern);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteMentorAsync(int mentorId)
        {
            var mentor = await _context.Mentors.FirstOrDefaultAsync(i => i.Id == mentorId);
            if (mentor == null)
            {
                return false;
            }

            var interns = await _context.Interns.Where(i => i.MentorId == mentorId).ToListAsync();
            foreach (var intern in interns)
            {
                intern.MentorId = null;
            }

            _context.Mentors.Remove(mentor);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}