using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.Data;
using InterntManagementSystem.DTOs.Task;
using InterntManagementSystem.Interface.Repository.Task;
using Microsoft.EntityFrameworkCore;

namespace InterntManagementSystem.Repository.Assigments
{
    public class Assigments : IAssigmentRepository
    {

        private readonly ApplicationDBContext _context;

        public Assigments(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<CreateAssigmentDto> CreateTaskAsync(CreateAssigmentDto taskCreateDto)
        {
            var task = Mapping.TaskMapper.TaskMapper.MapToModel(taskCreateDto);
            if (task == null)
            {
                throw new ArgumentNullException(nameof(taskCreateDto), "Task creation failed due to null mapping.");
            }
            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();

            taskCreateDto.Id = task.Id;
            return taskCreateDto;
        }

        public async Task<bool> DeleteTaskAsync(int taskId)
        {
            return await _context.Tasks
                .Where(t => t.Id == taskId)
                .ExecuteDeleteAsync() > 0;
        }

        public async Task<List<AssigmentDto>> GetAllTasksAsync()
        {
            return await _context.Tasks
                .Select(t => new AssigmentDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    TaskType = t.TaskType,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<AssigmentDto> GetTaskByIdAsync(int taskId)
        {
            var task = await _context.Tasks
                .Where(t => t.Id == taskId)
                .Select(t => new AssigmentDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    TaskType = t.TaskType,
                    CreatedAt = t.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (task == null)
            {
                throw new KeyNotFoundException($"Task with ID {taskId} not found.");
            }

            return task;
        }
        public async Task<UpdateAssigmentDto> UpdateTaskAsync(UpdateAssigmentDto updateTask)
        {
            var task = await _context.Tasks.FindAsync(updateTask.Id);
            if (task == null)
            {
                throw new ArgumentNullException(nameof(updateTask), "Task not found.");
            }

            task.Title = updateTask.Title ?? task.Title;
            task.Description = updateTask.Description ?? task.Description;
            task.TaskType = updateTask.TaskType ?? task.TaskType;

            await _context.SaveChangesAsync();

            var updatedDto = new UpdateAssigmentDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                TaskType = task.TaskType
            };

            return updatedDto;
        }



    }
}
