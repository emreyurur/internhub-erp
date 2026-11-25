using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.Data;
using InterntManagementSystem.DTOs;
using InterntManagementSystem.DTOs.Mentor;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Interface.Repository.Mentor;
using InterntManagementSystem.Mapping.MentorMapper;
using InterntManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace InterntManagementSystem.Repository.Mentors
{
    public class Mentors : IMentorRepository
    {
        private readonly ApplicationDBContext _context;

        public Mentors(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<InternTaskCreateDto> CreateInternTaskAsync(InternTaskCreateDto taskCreateDto)
        {
            await _context.InternTasks
                .AddAsync(MentorMapper.MapToModel(taskCreateDto));
            await _context.SaveChangesAsync();

            return taskCreateDto;
        }

        public async Task<bool> DeleteInternTaskAsync(int taskId)
        {
            return await _context.InternTasks
                .Where(t => t.Id == taskId)
                .ExecuteDeleteAsync() > 0;
        }

        public Task<InternListDto?> GetInternByIdAsync(int internId)
        {
            return _context.Interns
                .Include(i => i.Mentor)
                .Where(u => u.Id == internId)
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
                .FirstOrDefaultAsync();
        }

        public async Task<List<InternListDto>> GetInternsByMentorIdAsync(int mentorId)
        {
            return await _context.Interns
                .Include(i => i.Mentor)
                .Where(intern => intern.MentorId == mentorId)
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

        public async Task<List<InternTaskListDto>> GetTasksByInternIdAsync(int internId)
        {
            return await _context.InternTasks
                .Where(task => task.AssignedToId == internId)
                .Include(task => task.Assignment)
                .Select(task => new InternTaskListDto
                {
                    Id = task.Id,
                    AssignmentId = task.AssignmentId,
                    AssignedToId = task.AssignedToId,
                    AssignedById = task.AssignedById,
                    Title = task.Assignment != null ? task.Assignment.Title ?? "No Title" : "No Title",
                    Description = task.Assignment != null ? task.Assignment.Description ?? "No Description" : "No Description",
                    TaskType = task.Assignment != null ? task.Assignment.TaskType : TaskType.Project,
                    IsCompleted = task.IsCompleted,
                    Deadline = task.Deadline,
                    CreatedAt = task.CreatedAt,
                    StartDate = task.StartDate,
                    CompletedAt = task.CompletedAt
                })
                .ToListAsync();
        }

        public async Task<bool> LoginAsync(InternLogin mentorLogin)
        {
            var mentor = await _context.Mentors
                .FirstOrDefaultAsync(m => m.Email.ToLower() == mentorLogin.Email.ToLower());

            if (mentor == null)
                return false;

            return BCrypt.Net.BCrypt.Verify(mentorLogin.Password, mentor.HashedPassword);
        }

        public async Task<UpdateCreatedTaskDto?> UpdateInternTaskAsync(UpdateCreatedTaskDto updateTask)
        {
            var task = await _context.InternTasks
                .Include(t => t.Assignment)
                .FirstOrDefaultAsync(t => t.Id == updateTask.Id);

            if (task == null) return null;
            task.Deadline = updateTask.Deadline ?? task.Deadline;
            task.IsCompleted = updateTask.IsCompleted ?? task.IsCompleted;
            task.StartDate = updateTask.StartDate ?? task.StartDate;
            task.CompletedAt = updateTask.CompletedAt ?? task.CompletedAt;
            task.AssignedToId = updateTask.AssignedToId ?? task.AssignedToId;
            task.AssignedById = updateTask.AssignedById ?? task.AssignedById;
            task.CreatedAt = updateTask.CreatedAt ?? task.CreatedAt;
            task.AssignmentId = updateTask.AssignmentId ?? task.AssignmentId;

            await _context.SaveChangesAsync();

            return new UpdateCreatedTaskDto
            {
                Id = task.Id,
                Deadline = task.Deadline,
                StartDate = task.StartDate,
                AssignedToId = task.AssignedToId,
                AssignedById = task.AssignedById,
                IsCompleted = task.IsCompleted,
                CompletedAt = task.CompletedAt,
                CreatedAt = task.CreatedAt,
                AssignmentId = task.AssignmentId
            };
        }
    }
}