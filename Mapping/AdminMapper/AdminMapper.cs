using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InterntManagementSystem.DTOs.User;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.Mapping.AdminMapper
{
    public class AdminMapper
    {
        public static Mentor MapToMentorModel(CreateMentor createMentor)
        {
            return new Mentor
            {
                Name = createMentor.Name,
                Lastname = createMentor.Lastname,
                Email = createMentor.Email,
                Discipline = createMentor.Discipline,
                HashedPassword = createMentor.HashedPassword ?? string.Empty,
                Department = createMentor.Department,
                IsFirstLogin = createMentor.IsFirstLogin,
                Role = Role.Mentor
            };
        }
        public static CreateMentorReturnDto MapToCreateMentorReturnDto(CreateMentor mentor, string password)
        {
            return new CreateMentorReturnDto
            {
                Name = mentor.Name,
                Lastname = mentor.Lastname,
                Email = mentor.Email,
                Discipline = mentor.Discipline,
                HashedPassword = mentor.HashedPassword,
                Department = mentor.Department,
                IsFirstLogin = mentor.IsFirstLogin,
                Role = Role.Mentor,
                password = password
            };
        }

        public static Intern MapToInternModel(CreateIntern createIntern)
        {
            return new Intern
            {
                Name = createIntern.Name,
                Lastname = createIntern.Lastname,
                Email = createIntern.Email,
                MentorId = createIntern.MentorId,
                Phone = createIntern.Phone,
                University = createIntern.University,
                Discipline = createIntern.Discipline,
                HashedPassword = createIntern.HashedPassword ?? string.Empty,
                Department = createIntern.Department,
                IsFirstLogin = createIntern.IsFirstLogin,
                CreatedAt = createIntern.CreatedAt,
                EndDate = createIntern.EndDate,
                Role = Role.Intern
            };
        }

        public static CreateInternReturnDto MapToCreateInternReturnDto(CreateIntern intern, string password)
        {
            return new CreateInternReturnDto
            {
                Name = intern.Name,
                Lastname = intern.Lastname,
                Email = intern.Email,
                MentorId = intern.MentorId,
                Phone = intern.Phone,
                University = intern.University,
                Discipline = intern.Discipline,
                HashedPassword = intern.HashedPassword,
                Department = intern.Department,
                IsFirstLogin = intern.IsFirstLogin,
                CreatedAt = intern.CreatedAt,
                EndDate = intern.EndDate,
                Role = Role.Intern,
                password = password
            };
        }
    }
}