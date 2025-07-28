using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InterntManagementSystem.DTOs.Mentor
{
    public class MentorDto
    {

    }

    public class MentorLoginDto
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }

    public class InternTaskCreateDto
    {
        public DateTime Deadline { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public int AssignedToId { get; set; } // InternId ile aynı
        public int AssignedById { get; set; } // MentorId ile aynı
        public bool IsCompleted { get; set; } = false;
        public DateTime? CompletedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int AssignmentId { get; set; }
    }

    public class UpdateCreatedTaskDto
    {
        public int Id { get; set; } // InternTask veya Assignment Id
        public DateTime? Deadline { get; set; } // Assignment ve InternTask için
        public DateTime? StartDate { get; set; } // InternTask için
        public int? AssignedToId { get; set; } // InternTask için
        public int? AssignedById { get; set; } // InternTask için
        public bool? IsCompleted { get; set; } // InternTask için
        public DateTime? CompletedAt { get; set; } // InternTask için
        public DateTime? CreatedAt { get; set; } // Assignment ve InternTask için
        public int? AssignmentId { get; set; } // InternTask için


    }


}