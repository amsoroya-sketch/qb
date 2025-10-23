using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using QueryBuilderDemo.Tests.Data;

namespace QueryBuilderDemo.Tests.Helpers
{
    public static class TestDbContextFactory
    {
        private class DisposableContext : IDisposable
        {
            public ApplicationDbContext Context { get; }
            private readonly SqliteConnection _connection;

            public DisposableContext(ApplicationDbContext context, SqliteConnection connection)
            {
                Context = context;
                _connection = connection;
            }

            public void Dispose()
            {
                Context?.Dispose();
                _connection?.Dispose();
            }
        }

        /// <summary>
        /// Creates an in-memory SQLite database context for testing.
        /// The connection is kept open to maintain the database in memory.
        /// IMPORTANT: Dispose the context to properly clean up resources.
        /// </summary>
        public static ApplicationDbContext CreateInMemoryContext()
        {
            var connection = new SqliteConnection("DataSource=:memory:;Cache=Shared");
            connection.Open();

            // Configure SQLite to reduce temp file usage
            using (var command = connection.CreateCommand())
            {
                command.CommandText = @"
                    PRAGMA temp_store = MEMORY;
                    PRAGMA journal_mode = MEMORY;
                    PRAGMA synchronous = OFF;
                    PRAGMA cache_size = -64000;
                ";
                command.ExecuteNonQuery();
            }

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(connection)
                .Options;

            var context = new TestApplicationDbContext(options, connection);
            context.Database.EnsureCreated();

            return context;
        }

        /// <summary>
        /// Creates an in-memory SQLite database context with sample data seeded.
        /// </summary>
        public static ApplicationDbContext CreateSeededContext()
        {
            var context = CreateInMemoryContext();
            SampleDataSeeder.SeedTestData(context);
            return context;
        }

        /// <summary>
        /// Custom ApplicationDbContext that properly disposes the SQLite connection.
        /// </summary>
        private class TestApplicationDbContext : ApplicationDbContext
        {
            private readonly SqliteConnection _connection;

            public TestApplicationDbContext(DbContextOptions<ApplicationDbContext> options, SqliteConnection connection)
                : base(options)
            {
                _connection = connection;
            }

            public override void Dispose()
            {
                base.Dispose();
                _connection?.Dispose();
            }

            public override async ValueTask DisposeAsync()
            {
                await base.DisposeAsync();
                if (_connection != null)
                {
                    await _connection.DisposeAsync();
                }
            }
        }
    }
}
