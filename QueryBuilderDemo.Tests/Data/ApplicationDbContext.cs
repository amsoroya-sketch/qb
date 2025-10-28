using Microsoft.EntityFrameworkCore;
using QueryBuilderDemo.Tests.Models;

namespace QueryBuilderDemo.Tests.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet properties for all entities
        public DbSet<Organisation> Organisations { get; set; } = null!;
        public DbSet<Department> Departments { get; set; } = null!;
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<MdTask> Tasks { get; set; } = null!;
        public DbSet<Models.Location> Locations { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Skill> Skills { get; set; } = null!;
        public DbSet<Certification> Certifications { get; set; } = null!;
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<Meeting> Meetings { get; set; } = null!;
        public DbSet<Schedule> Schedules { get; set; } = null!;
        public DbSet<Client> Clients { get; set; } = null!;
        public DbSet<Invoice> Invoices { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Organisation -> Departments (1:N)
            modelBuilder.Entity<Department>()
                .HasOne(d => d.Organisation)
                .WithMany(o => o.Departments)
                .HasForeignKey(d => d.OrganisationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Department>()
                .Property(d => d.Budget)
                .HasPrecision(18, 2);

            // Department -> Employees (1:N)
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Role -> Employees (1:N)
            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Role)
                .WithMany(r => r.Employees)
                .HasForeignKey(e => e.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            // Employee -> Schedule (1:1)
            modelBuilder.Entity<Schedule>()
                .HasOne(s => s.Employee)
                .WithOne(e => e.Schedule)
                .HasForeignKey<Schedule>(s => s.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee -> Certifications (1:N)
            modelBuilder.Entity<Certification>()
                .HasOne(c => c.Employee)
                .WithMany(e => e.Certifications)
                .HasForeignKey(c => c.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee <-> Skills (N:M)
            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Skills)
                .WithMany(s => s.Employees)
                .UsingEntity(j => j.ToTable("EmployeeSkills"));

            // Employee <-> Projects (N:M)
            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Projects)
                .WithMany(p => p.TeamMembers)
                .UsingEntity(j => j.ToTable("EmployeeProjects"));

            // Employee <-> Teams (N:M)
            modelBuilder.Entity<Employee>()
                .HasMany(e => e.Teams)
                .WithMany(t => t.Members)
                .UsingEntity(j => j.ToTable("EmployeeTeams"));

            // Location -> Clients (1:N)
            modelBuilder.Entity<Client>()
                .HasOne(c => c.Location)
                .WithMany(l => l.Clients)
                .HasForeignKey(c => c.LocationId)
                .OnDelete(DeleteBehavior.Restrict);

            // Client -> Projects (1:N)
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Client)
                .WithMany(c => c.Projects)
                .HasForeignKey(p => p.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Project>()
                .Property(p => p.Budget)
                .HasPrecision(18, 2);

            // Project -> Tasks (1:N)
            modelBuilder.Entity<MdTask>()
                .HasOne(t => t.Project)
                .WithMany(p => p.Tasks)
                .HasForeignKey(t => t.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee -> Tasks (1:N, optional)
            modelBuilder.Entity<MdTask>()
                .HasOne(t => t.AssignedTo)
                .WithMany(e => e.Tasks)
                .HasForeignKey(t => t.AssignedToId)
                .OnDelete(DeleteBehavior.SetNull);

            // Client -> Invoices (1:N)
            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Client)
                .WithMany(c => c.Invoices)
                .HasForeignKey(i => i.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Invoice>()
                .Property(i => i.Amount)
                .HasPrecision(18, 2);

            // Invoice -> Payments (1:N)
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Invoice)
                .WithMany(i => i.Payments)
                .HasForeignKey(p => p.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            // Team -> Meetings (1:N)
            modelBuilder.Entity<Meeting>()
                .HasOne(m => m.Team)
                .WithMany(t => t.Meetings)
                .HasForeignKey(m => m.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
