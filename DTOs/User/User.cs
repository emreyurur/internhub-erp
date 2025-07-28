using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.DTOs.User
{
    public class UserDto
    {
        public required string Name { get; set; }
        public required string Lastname { get; set; }
        public required string Email { get; set; }

        [JsonIgnore]
        public string? HashedPassword { get; set; }
        public required string Department { get; set; }
        public bool IsFirstLogin { get; set; } = true;

    }

    public class CreateMentor : UserDto
    {
        public required Discipline Discipline { get; set; }

        [DefaultValue(Role.Mentor)]
        public Role Role { get; set; } = Role.Mentor;
    }

    public class CreateIntern : UserDto
    {
        public int? MentorId { get; set; }

        public string? Phone { get; set; }
        public string? University { get; set; }
        public required Discipline Discipline { get; set; }

        [DefaultValue(Role.Intern)]
        public required Role Role { get; set; } = Role.Intern;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; } = DateTime.UtcNow.AddDays(30); // Default olarak 30 gün eklendi (20 iş günü baz alındı)
    }

    public class CreateInternReturnDto : CreateIntern
    {
        public string password { get; set; } = string.Empty; // Şifre, intern oluşturulurken döndürülecek
    }

    public class CreateMentorReturnDto : CreateMentor
    {
        public string password { get; set; } = string.Empty; // Şifre, mentor oluşturulurken döndürülecek
    }
}