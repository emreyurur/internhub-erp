using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InterntManagementSystem.Models
{
    public class Intern : User
    {
        public int? MentorId { get; set; }

        [ForeignKey(nameof(MentorId))]
        public Mentor? Mentor { get; set; }

        public string? Phone { get; set; }
        public string? University { get; set; }
        public required Discipline Discipline { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }

    }
}