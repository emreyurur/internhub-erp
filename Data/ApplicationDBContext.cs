using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using InterntManagementSystem.Models;

namespace InterntManagementSystem.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options)
            : base(options)
        {
        }

        public DbSet<Intern> Interns { get; set; }
        public DbSet<Mentor> Mentors { get; set; }
        public DbSet<Assignment> Tasks { get; set; }
        public DbSet<InternTask> InternTasks { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Admin>().ToTable("Admins");
            modelBuilder.Entity<Mentor>().ToTable("Mentors");
            modelBuilder.Entity<Intern>().ToTable("Interns");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Assignment>().ToTable("Tasks");
            modelBuilder.Entity<InternTask>().ToTable("InternTasks");

            // Mentor-Intern ilişkisi
            modelBuilder.Entity<Intern>()
                .HasOne(i => i.Mentor)
                .WithMany(m => m.Interns)
                .HasForeignKey(i => i.MentorId)
                .OnDelete(DeleteBehavior.NoAction);

            // // Assignment - CreatedBy ilişkisi
            // modelBuilder.Entity<Assignment>()
            //     .HasOne()
            //     .WithMany()
            //     .HasForeignKey(a => a.CreatedById)
            //     .OnDelete(DeleteBehavior.NoAction);

            // InternTask - Assignment ilişkisi (Assignment silinirse InternTask da silinir)
            modelBuilder.Entity<InternTask>()
                .HasOne(it => it.Assignment)
                .WithMany()
                .HasForeignKey(it => it.AssignmentId)
                .OnDelete(DeleteBehavior.Cascade);

            // InternTask - AssignedBy ilişkisi
            modelBuilder.Entity<InternTask>()
                .HasOne(it => it.AssignedBy)
                .WithMany()
                .HasForeignKey(it => it.AssignedById)
                .OnDelete(DeleteBehavior.NoAction);

            // InternTask - AssignedTo ilişkisi
            modelBuilder.Entity<InternTask>()
                .HasOne(it => it.AssignedTo)
                .WithMany()
                .HasForeignKey(it => it.AssignedToId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}