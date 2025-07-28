using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.DTOs
{
    public class InternProfileDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Lastname { get; set; }
        public required string Email { get; set; }
        public required string Department { get; set; }
        public string? MentorName { get; set; }

        public string? MentorLastname { get; set; }

        public Discipline MentorDiscipline { get; set; }
        public Role Role { get; set; }
    }



    public class InternLogin
    {
        public required string Password { get; set; }
        public required string Email { get; set; }
    }

    public class UpdateTask
    {
        public int id { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class InternTaskDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public DateTime Deadline { get; set; }
        public bool IsCompleted { get; set; }
        public String InternName { get; set; } = String.Empty; // Intern ID
        public string MentorName { get; set; } = String.Empty; // Mentor ID

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime StartDate { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
    
    public class InternTaskListDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public DateTime Deadline { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime StartDate { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}