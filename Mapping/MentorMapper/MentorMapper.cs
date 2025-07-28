using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs.Mentor;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.Mapping.MentorMapper
{
    public static class MentorMapper
    {

        public static InternTask MapToModel(InternTaskCreateDto taskCreateDto)
        {
            return new InternTask
            {
                Deadline = taskCreateDto.Deadline,
                StartDate = taskCreateDto.StartDate,
                AssignedToId = taskCreateDto.AssignedToId,
                AssignedById = taskCreateDto.AssignedById,
                IsCompleted = taskCreateDto.IsCompleted,
                CompletedAt = taskCreateDto.CompletedAt,
                CreatedAt = taskCreateDto.CreatedAt,
                AssignmentId = taskCreateDto.AssignmentId,
            };

        }


    }
}
