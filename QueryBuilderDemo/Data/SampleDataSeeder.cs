using QueryBuilderDemo.Models;

namespace QueryBuilderDemo.Data
{
    public static class SampleDataSeeder
    {
        public static void SeedTestData(ApplicationDbContext context)
        {
            // Clear existing data
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            // Create Locations
            var locationSF = new Location
            {
                City = "San Francisco",
                State = "California",
                Country = "USA"
            };

            var locationNY = new Location
            {
                City = "New York",
                State = "New York",
                Country = "USA"
            };

            var locationLondon = new Location
            {
                City = "London",
                State = "England",
                Country = "UK"
            };

            context.Locations.AddRange(locationSF, locationNY, locationLondon);
            context.SaveChanges();

            // Create Organisations
            var techCorp = new Organisation
            {
                Name = "TechCorp Inc",
                Industry = "Technology",
                FoundYear = 2010
            };

            var buildRight = new Organisation
            {
                Name = "BuildRight Ltd",
                Industry = "Construction",
                FoundYear = 2005
            };

            context.Organisations.AddRange(techCorp, buildRight);
            context.SaveChanges();

            // Create Departments
            var engineering = new Department
            {
                Name = "Engineering",
                Budget = 5000000m,
                Head = "Alice Johnson",
                OrganisationId = techCorp.Id
            };

            var hr = new Department
            {
                Name = "Human Resources",
                Budget = 1000000m,
                Head = "Bob Smith",
                OrganisationId = techCorp.Id
            };

            var finance = new Department
            {
                Name = "Finance",
                Budget = 2000000m,
                Head = "Carol Williams",
                OrganisationId = techCorp.Id
            };

            var construction = new Department
            {
                Name = "Construction",
                Budget = 8000000m,
                Head = "David Brown",
                OrganisationId = buildRight.Id
            };

            var projectManagement = new Department
            {
                Name = "Project Management",
                Budget = 1500000m,
                Head = "Emma Davis",
                OrganisationId = buildRight.Id
            };

            var safety = new Department
            {
                Name = "Safety & Compliance",
                Budget = 800000m,
                Head = "Frank Miller",
                OrganisationId = buildRight.Id
            };

            context.Departments.AddRange(engineering, hr, finance, construction, projectManagement, safety);
            context.SaveChanges();

            // Create Roles
            var seniorDev = new Role
            {
                Title = "Senior Developer",
                Level = "Senior",
                Description = "Lead software development projects"
            };

            var juniorDev = new Role
            {
                Title = "Junior Developer",
                Level = "Junior",
                Description = "Assist in software development"
            };

            var hrManager = new Role
            {
                Title = "HR Manager",
                Level = "Manager",
                Description = "Manage human resources operations"
            };

            var accountant = new Role
            {
                Title = "Accountant",
                Level = "Mid",
                Description = "Handle financial records and reporting"
            };

            var constructionManager = new Role
            {
                Title = "Construction Manager",
                Level = "Senior",
                Description = "Oversee construction projects"
            };

            var safetyOfficer = new Role
            {
                Title = "Safety Officer",
                Level = "Mid",
                Description = "Ensure workplace safety compliance"
            };

            context.Roles.AddRange(seniorDev, juniorDev, hrManager, accountant, constructionManager, safetyOfficer);
            context.SaveChanges();

            // Create Skills
            var csharp = new Skill { Name = "C#", Proficiency = "Expert", Category = "Programming" };
            var python = new Skill { Name = "Python", Proficiency = "Advanced", Category = "Programming" };
            var javascript = new Skill { Name = "JavaScript", Proficiency = "Intermediate", Category = "Programming" };
            var projectMgmt = new Skill { Name = "Project Management", Proficiency = "Expert", Category = "Management" };
            var communication = new Skill { Name = "Communication", Proficiency = "Advanced", Category = "Soft Skills" };
            var leadership = new Skill { Name = "Leadership", Proficiency = "Expert", Category = "Management" };

            context.Skills.AddRange(csharp, python, javascript, projectMgmt, communication, leadership);
            context.SaveChanges();

            // Create Employees
            var emp1 = new Employee
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@techcorp.com",
                DepartmentId = engineering.Id,
                RoleId = seniorDev.Id
            };

            var emp2 = new Employee
            {
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@techcorp.com",
                DepartmentId = engineering.Id,
                RoleId = juniorDev.Id
            };

            var emp3 = new Employee
            {
                FirstName = "Michael",
                LastName = "Johnson",
                Email = "michael.johnson@techcorp.com",
                DepartmentId = hr.Id,
                RoleId = hrManager.Id
            };

            var emp4 = new Employee
            {
                FirstName = "Sarah",
                LastName = "Williams",
                Email = "sarah.williams@techcorp.com",
                DepartmentId = finance.Id,
                RoleId = accountant.Id
            };

            var emp5 = new Employee
            {
                FirstName = "Robert",
                LastName = "Brown",
                Email = "robert.brown@buildright.com",
                DepartmentId = construction.Id,
                RoleId = constructionManager.Id
            };

            var emp6 = new Employee
            {
                FirstName = "Lisa",
                LastName = "Garcia",
                Email = "lisa.garcia@buildright.com",
                DepartmentId = safety.Id,
                RoleId = safetyOfficer.Id
            };

            context.Employees.AddRange(emp1, emp2, emp3, emp4, emp5, emp6);
            context.SaveChanges();

            // Create Schedules
            var schedule1 = new Schedule
            {
                Day = "Monday-Friday",
                StartTime = new TimeSpan(9, 0, 0),
                EndTime = new TimeSpan(17, 0, 0),
                EmployeeId = emp1.Id
            };

            var schedule2 = new Schedule
            {
                Day = "Monday-Friday",
                StartTime = new TimeSpan(8, 0, 0),
                EndTime = new TimeSpan(16, 0, 0),
                EmployeeId = emp2.Id
            };

            var schedule3 = new Schedule
            {
                Day = "Monday-Friday",
                StartTime = new TimeSpan(9, 30, 0),
                EndTime = new TimeSpan(18, 0, 0),
                EmployeeId = emp5.Id
            };

            context.Schedules.AddRange(schedule1, schedule2, schedule3);
            context.SaveChanges();

            // Create Certifications
            var cert1 = new Certification
            {
                Name = "Azure Developer Associate",
                Issuer = "Microsoft",
                ValidUntil = new DateTime(2026, 12, 31),
                EmployeeId = emp1.Id
            };

            var cert2 = new Certification
            {
                Name = "Scrum Master",
                Issuer = "Scrum Alliance",
                ValidUntil = new DateTime(2025, 6, 30),
                EmployeeId = emp1.Id
            };

            var cert3 = new Certification
            {
                Name = "OSHA Safety Certification",
                Issuer = "OSHA",
                ValidUntil = new DateTime(2026, 3, 15),
                EmployeeId = emp6.Id
            };

            context.Certifications.AddRange(cert1, cert2, cert3);
            context.SaveChanges();

            // Link Employees to Skills (many-to-many)
            emp1.Skills.AddRange(new[] { csharp, python, leadership });
            emp2.Skills.AddRange(new[] { csharp, javascript });
            emp3.Skills.AddRange(new[] { communication, leadership });
            emp5.Skills.AddRange(new[] { projectMgmt, leadership });
            context.SaveChanges();

            // Create Clients
            var client1 = new Client
            {
                Name = "Acme Corporation",
                Industry = "Retail",
                LocationId = locationSF.Id
            };

            var client2 = new Client
            {
                Name = "GlobalTech Solutions",
                Industry = "Technology",
                LocationId = locationNY.Id
            };

            var client3 = new Client
            {
                Name = "City Infrastructure Authority",
                Industry = "Government",
                LocationId = locationLondon.Id
            };

            context.Clients.AddRange(client1, client2, client3);
            context.SaveChanges();

            // Create Projects
            var project1 = new Project
            {
                Title = "E-Commerce Platform Redesign",
                Deadline = new DateTime(2025, 12, 31),
                Budget = 500000m,
                ClientId = client1.Id
            };

            var project2 = new Project
            {
                Title = "Mobile App Development",
                Deadline = new DateTime(2025, 9, 30),
                Budget = 300000m,
                ClientId = client2.Id
            };

            var project3 = new Project
            {
                Title = "Cloud Migration",
                Deadline = new DateTime(2026, 3, 15),
                Budget = 750000m,
                ClientId = client2.Id
            };

            var project4 = new Project
            {
                Title = "Bridge Construction Project",
                Deadline = new DateTime(2027, 6, 30),
                Budget = 5000000m,
                ClientId = client3.Id
            };

            context.Projects.AddRange(project1, project2, project3, project4);
            context.SaveChanges();

            // Link Employees to Projects (many-to-many)
            project1.TeamMembers.AddRange(new[] { emp1, emp2 });
            project2.TeamMembers.AddRange(new[] { emp1, emp2 });
            project3.TeamMembers.Add(emp1);
            project4.TeamMembers.Add(emp5);
            context.SaveChanges();

            // Create Tasks
            var task1 = new Models.Task
            {
                Title = "Design database schema",
                Status = "Completed",
                DueDate = new DateTime(2025, 11, 15),
                ProjectId = project1.Id,
                AssignedToId = emp1.Id
            };

            var task2 = new Models.Task
            {
                Title = "Implement payment gateway",
                Status = "In Progress",
                DueDate = new DateTime(2025, 11, 30),
                ProjectId = project1.Id,
                AssignedToId = emp2.Id
            };

            var task3 = new Models.Task
            {
                Title = "Setup CI/CD pipeline",
                Status = "Pending",
                DueDate = new DateTime(2025, 12, 15),
                ProjectId = project1.Id,
                AssignedToId = emp1.Id
            };

            var task4 = new Models.Task
            {
                Title = "Design UI mockups",
                Status = "Completed",
                DueDate = new DateTime(2025, 11, 1),
                ProjectId = project2.Id,
                AssignedToId = emp2.Id
            };

            var task5 = new Models.Task
            {
                Title = "Implement authentication",
                Status = "In Progress",
                DueDate = new DateTime(2025, 11, 20),
                ProjectId = project2.Id,
                AssignedToId = emp1.Id
            };

            var task6 = new Models.Task
            {
                Title = "Assess current infrastructure",
                Status = "Completed",
                DueDate = new DateTime(2025, 11, 10),
                ProjectId = project3.Id,
                AssignedToId = emp1.Id
            };

            var task7 = new Models.Task
            {
                Title = "Survey construction site",
                Status = "Completed",
                DueDate = new DateTime(2025, 10, 31),
                ProjectId = project4.Id,
                AssignedToId = emp5.Id
            };

            var task8 = new Models.Task
            {
                Title = "Acquire building permits",
                Status = "In Progress",
                DueDate = new DateTime(2025, 12, 1),
                ProjectId = project4.Id,
                AssignedToId = null // Unassigned task
            };

            context.Tasks.AddRange(task1, task2, task3, task4, task5, task6, task7, task8);
            context.SaveChanges();

            // Create Teams
            var team1 = new Team
            {
                Name = "Platform Team",
                Purpose = "Develop and maintain core platform",
                Size = 5
            };

            var team2 = new Team
            {
                Name = "Infrastructure Team",
                Purpose = "Manage cloud infrastructure and DevOps",
                Size = 3
            };

            var team3 = new Team
            {
                Name = "Construction Crew A",
                Purpose = "Primary construction team for bridge project",
                Size = 10
            };

            context.Teams.AddRange(team1, team2, team3);
            context.SaveChanges();

            // Link Employees to Teams (many-to-many)
            team1.Members.AddRange(new[] { emp1, emp2 });
            team2.Members.Add(emp1);
            team3.Members.Add(emp5);
            context.SaveChanges();

            // Create Meetings
            var meeting1 = new Meeting
            {
                Topic = "Sprint Planning",
                ScheduleTime = new DateTime(2025, 11, 15, 10, 0, 0),
                Duration = 60,
                TeamId = team1.Id
            };

            var meeting2 = new Meeting
            {
                Topic = "Daily Standup",
                ScheduleTime = new DateTime(2025, 11, 16, 9, 0, 0),
                Duration = 15,
                TeamId = team1.Id
            };

            var meeting3 = new Meeting
            {
                Topic = "Infrastructure Review",
                ScheduleTime = new DateTime(2025, 11, 17, 14, 0, 0),
                Duration = 90,
                TeamId = team2.Id
            };

            var meeting4 = new Meeting
            {
                Topic = "Safety Briefing",
                ScheduleTime = new DateTime(2025, 11, 18, 8, 0, 0),
                Duration = 30,
                TeamId = team3.Id
            };

            context.Meetings.AddRange(meeting1, meeting2, meeting3, meeting4);
            context.SaveChanges();

            // Create Invoices
            var invoice1 = new Invoice
            {
                Amount = 250000m,
                DateIssued = new DateTime(2025, 10, 1),
                DueDate = new DateTime(2025, 11, 1),
                ClientId = client1.Id
            };

            var invoice2 = new Invoice
            {
                Amount = 150000m,
                DateIssued = new DateTime(2025, 10, 15),
                DueDate = new DateTime(2025, 11, 15),
                ClientId = client2.Id
            };

            var invoice3 = new Invoice
            {
                Amount = 1000000m,
                DateIssued = new DateTime(2025, 11, 1),
                DueDate = new DateTime(2025, 12, 1),
                ClientId = client3.Id
            };

            context.Invoices.AddRange(invoice1, invoice2, invoice3);
            context.SaveChanges();

            // Create Payments
            var payment1 = new Payment
            {
                Amount = 250000m,
                DatePaid = new DateTime(2025, 10, 28),
                Method = "Wire Transfer",
                InvoiceId = invoice1.Id
            };

            var payment2 = new Payment
            {
                Amount = 75000m,
                DatePaid = new DateTime(2025, 11, 10),
                Method = "Check",
                InvoiceId = invoice2.Id
            };

            var payment3 = new Payment
            {
                Amount = 75000m,
                DatePaid = new DateTime(2025, 11, 14),
                Method = "Check",
                InvoiceId = invoice2.Id
            };

            var payment4 = new Payment
            {
                Amount = 500000m,
                DatePaid = new DateTime(2025, 11, 15),
                Method = "Wire Transfer",
                InvoiceId = invoice3.Id
            };

            context.Payments.AddRange(payment1, payment2, payment3, payment4);
            context.SaveChanges();
        }
    }
}
