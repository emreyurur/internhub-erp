using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InterntManagementSystem.Models
{
    

   public enum Role
    {
        Admin = 0,
        Mentor = 1,
        Intern = 2
    }

public abstract class User
    {
        [Key]
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Lastname { get; set; }
        public required string Email { get; set; }
        public required string HashedPassword { get; set; }
        public required string Department { get; set; }
        public bool IsFirstLogin { get; set; } = true;
        public Role Role { get; set; }

    }

}