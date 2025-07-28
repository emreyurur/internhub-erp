using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterntManagementSystem.Models
{
    public enum TaskType
    {
        Project,
        Domain,
        Meeting
    }

    public class Assignment
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public TaskType TaskType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}