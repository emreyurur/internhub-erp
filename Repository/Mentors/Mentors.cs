using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.Data;
using InterntManagementSystem.DTOs;
using InterntManagementSystem.DTOs.Mentor;
using InterntManagementSystem.Interface.Repository.Mentor;
using InterntManagementSystem.Mapping.MentorMapper;
using InterntManagementSystem.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace InterntManagementSystem.Repository.Mentors
{
    public class Mentors : IMentorRepository
    {


        private readonly ApplicationDBContext _context;

        public Mentors(ApplicationDBContext contex)
        {
            _context = contex;

        }


        //bu kısımda task oluşturma işlemi yapılıyor
        // intern task oluşturma işlemi yok şuan
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

        //buna gerek var mı ?
        public Task<Intern?> GetInternByIdAsync(int internId)
        {
            return _context.Interns
                .Include(i => i.Mentor)
                .FirstOrDefaultAsync(u => u.Id == internId);
        }

        public async Task<List<Intern>> GetInternsByMentorIdAsync(int mentorId)
        {
            return await _context.Interns
                .Where(intern => intern.MentorId == mentorId)
                .ToListAsync();
        }

        public async Task<List<InternTaskListDto>> GetTasksByInternIdAsync(int internId)
        {
            return await _context.InternTasks
                .Where(task => task.AssignedToId == internId)
                .Include(task => task.Assignment) // Assignment detaylarını da getir
                .Select(task => new InternTaskListDto
                {
                    Id = task.Id,
                    Title = task.Assignment != null ? task.Assignment.Title ?? "No Title" : "No Title",
                    Description = task.Assignment != null ? task.Assignment.Description ?? "No Description" : "No Description",
                    IsCompleted = task.IsCompleted,
                    Deadline = task.Deadline,
                    CreatedAt = task.CreatedAt,
                    StartDate = task.StartDate,
                    CompletedAt = task.CompletedAt
                })
                .ToListAsync();
        }

        public Task<bool> LoginAsync(InternLogin mentorLogin)
        {
            throw new NotImplementedException();
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