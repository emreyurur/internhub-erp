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
                .Include(it => it.Assignment)
                .Select(it => new InternTaskListDto
                {
                    Id = it.Id,
                    AssignmentId = it.AssignmentId,
                    AssignedToId = it.AssignedToId,
                    AssignedById = it.AssignedById,
                    Title = it.Assignment != null ? it.Assignment.Title ?? "No Title" : "No Title",
                    Description = it.Assignment != null ? it.Assignment.Description ?? "No Description" : "No Description",
                    TaskType = it.Assignment != null ? it.Assignment.TaskType : TaskType.Project,
                    Deadline = it.Deadline,
                    IsCompleted = it.IsCompleted,
                    CreatedAt = it.CreatedAt,
                    StartDate = it.StartDate,
                    CompletedAt = it.CompletedAt
                })
                .ToListAsync();
        }


        public async Task<InternProfileDto> GetInternByIdAsync(int internId)
        {
            var user = await _context.Interns
                .Include(i => i.Mentor)
                .FirstOrDefaultAsync(u => u.Id == internId)
                ?? throw new KeyNotFoundException($"User with ID {internId} not found.");

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

        public async Task<InternTaskDto> GetTaskByIdAsync(int taskId)
        {
            var task = await _context.InternTasks
                .Include(it => it.Assignment)
                .Include(it => it.AssignedTo)
                    .ThenInclude(i => i!.Mentor)
                .FirstOrDefaultAsync(it => it.Id == taskId);

            if (task == null)
                throw new KeyNotFoundException($"Task with ID {taskId} not found.");

            return new InternTaskDto
            {
                Id = task.Id,
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

        public async Task<Intern> LoginAsync(InternLogin userLogin)
        {
            var intern = await _context.Interns
                .FirstOrDefaultAsync(i => i.Email.ToLower() == userLogin.Email.ToLower());

            if (intern == null || !BCrypt.Net.BCrypt.Verify(userLogin.Password, intern.HashedPassword))
            {
                throw new UnauthorizedAccessException("Invalid credentials.");
            }

            return intern;
        }

        public async Task<InternTaskListDto> UpdateTaskAsync(UpdateTask updateTask)
        {
            var task = await _context.InternTasks
                .Include(it => it.Assignment)
                .FirstOrDefaultAsync(it => it.Id == updateTask.id);
            if (task == null)
            {
                throw new KeyNotFoundException($"Task with ID {updateTask.id} not found.");
            }
            task.IsCompleted = updateTask.IsCompleted;
            task.CompletedAt = updateTask.IsCompleted ? DateTime.UtcNow : null;

            _context.InternTasks.Update(task);
            await _context.SaveChangesAsync();

            return new InternTaskListDto
            {
                Id = task.Id,
                AssignmentId = task.AssignmentId,
                AssignedToId = task.AssignedToId,
                AssignedById = task.AssignedById,
                Title = task.Assignment != null ? task.Assignment.Title ?? "No Title" : "No Title",
                Description = task.Assignment != null ? task.Assignment.Description ?? "No Description" : "No Description",
                TaskType = task.Assignment != null ? task.Assignment.TaskType : TaskType.Project,
                Deadline = task.Deadline,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                StartDate = task.StartDate,
                CompletedAt = task.CompletedAt
            };
        }

    }
}