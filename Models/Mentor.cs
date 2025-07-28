using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace InterntManagementSystem.Models
{
    public class Mentor : User
    {
        public required Discipline Discipline { get; set; }

        // Mentorün sorumlu olduğu internler
        [JsonIgnore]
        public ICollection<Intern> Interns { get; set; } = new List<Intern>();
    }
}