using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace InterntManagementSystem.Models
{
    public class InternTask
    {
        public int Id { get; set; }

        public int AssignmentId { get; set; }
        [ForeignKey(nameof(AssignmentId))]
        public Assignment? Assignment { get; set; }

        public int AssignedToId { get; set; }
        [ForeignKey(nameof(AssignedToId))]
        public Intern? AssignedTo { get; set; }

        public int AssignedById { get; set; }
        [ForeignKey(nameof(AssignedById))]
        public User? AssignedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime StartDate { get; set; }
        public DateTime Deadline { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}