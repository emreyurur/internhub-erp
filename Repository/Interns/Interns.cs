using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.Data;
using InterntManagementSystem.DTOs;
using InterntManagementSystem.Interface.Repository;
using InterntManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace InterntManagementSystem.Repository.Users
{
    public class User : IUserRepository
    {
        private readonly ApplicationDBContext _context;

        public User(ApplicationDBContext context)
        {
            _context = context;
        }
        public async Task<List<InternTaskListDto>> GetAllTasksByUserIdAsync(int userId)
        {
            return await _context.InternTasks
                .Where(it => it.AssignedToId == userId)
                .Include(it => it.Assignment) // Assignment detaylarını da getir
                .Select(it => new InternTaskListDto
                {
                    Id = it.AssignmentId,
                    Title = it.Assignment != null ? it.Assignment.Title ?? "No Title" : "No Title",
                    Description = it.Assignment != null ? it.Assignment.Description ?? "No Description" : "No Description",
                    Deadline = it.Deadline,
                    IsCompleted = it.IsCompleted,
                    CreatedAt = it.CreatedAt,
                    StartDate = it.StartDate,
                    CompletedAt = it.CompletedAt
                })
                .ToListAsync();
        }


        //buna bi bak
        public async Task<InternProfileDto> GetInternByIdAsync(int internId)
        {
             var user = await _context.Interns
                .Include(i => i.Mentor)
                .FirstOrDefaultAsync(u => u.Id == internId)
                ?? throw new InvalidOperationException($"User with ID {internId} not found.");


            //burayı maplemen lazım ileride
            return new InternProfileDto
            {
                Id = user.Id,
                Name = user.Name,
                Lastname = user.Lastname,
                Email = user.Email,
                Department = user.Department,
                MentorName = user.Mentor?.Name ?? "N/A",
                MentorLastname = user.Mentor?.Lastname ?? "N/A",
                MentorDiscipline = user.Mentor?.Discipline ?? Discipline.Ios,
                Role = user.Role
            };
        }


        //buna da bak
        public async Task<InternTaskDto> GetTaskByIdAsync(int taskId)
        {
            var task = await _context.InternTasks
                .Include(it => it.Assignment)
                .Include(it => it.AssignedTo)
                    .ThenInclude(i => i.Mentor)
                .FirstOrDefaultAsync(it => it.AssignmentId == taskId);

            if (task == null)
                throw new InvalidOperationException($"Task with ID {taskId} not found.");

            return new InternTaskDto
            {
                Id = task.AssignmentId,
                Title = task.Assignment != null ? task.Assignment.Title ?? "No Title" : "No Title",
                Description = task.Assignment != null ? task.Assignment.Description ?? "No Description" : "No Description",
                Deadline = task.Deadline,
                IsCompleted = task.IsCompleted,
                InternName = task.AssignedTo?.Name ?? "N/A",
                MentorName = task.AssignedTo?.Mentor?.Name ?? "N/A",
                CreatedAt = task.CreatedAt,
                StartDate = task.StartDate,
                CompletedAt = task.CompletedAt
            };
        }

        public Task<Intern> LoginAsync(InternLogin userLogin)
        {
            throw new NotImplementedException();
        }

        public async Task<InternTaskListDto> UpdateTaskAsync(UpdateTask updateTask)
        {
            var task = await _context.InternTasks
                .Include(it => it.Assignment)
                .FirstOrDefaultAsync(it => it.AssignmentId == updateTask.id);
            if (task == null)
            {
                throw new InvalidOperationException($"Task with ID {updateTask.id} not found.");
            }
            task.IsCompleted = updateTask.IsCompleted;
            task.CompletedAt = DateTime.UtcNow;

             _context.InternTasks.Update(task);
            await _context.SaveChangesAsync();

            return new InternTaskListDto
            {
                Id = task.AssignmentId,
                Title = task.Assignment != null ? task.Assignment.Title ?? "No Title" : "No Title",
                Description = task.Assignment != null ? task.Assignment.Description ?? "No Description" : "No Description",
                Deadline = task.Deadline,
                IsCompleted = task.IsCompleted,

                CreatedAt = task.CreatedAt,
                StartDate = task.StartDate,
                CompletedAt = task.CompletedAt
            };
        }

    }
}