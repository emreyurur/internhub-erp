using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.DTOs.Task
{
    public class AssigmentDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public TaskType TaskType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }


    public class UpdateAssigmentDto
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public TaskType? TaskType { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
        public class CreateAssigmentDto
    {
        [JsonIgnore]
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public TaskType TaskType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}