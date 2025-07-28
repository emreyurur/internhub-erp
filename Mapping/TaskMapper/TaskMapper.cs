using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs.Task;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.Mapping.TaskMapper
{
    public class TaskMapper
    {

        public static Assignment MapToModel(CreateAssigmentDto taskCreateDto)
        {
            return new Assignment
            {
                Title = taskCreateDto.Title,
                Description = taskCreateDto.Description,
                TaskType = taskCreateDto.TaskType,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}