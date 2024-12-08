namespace signalR_backend.Data
{
    using Microsoft.EntityFrameworkCore;
    using signalR_backend.Models;

    public class AppDbContext : DbContext
    {
        public DbSet<Poll> Polls { get; set; }
        public DbSet<Option> Options { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<OptionUser> OptionUsers { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Poll-Option relationship
            modelBuilder.Entity<Option>()
                .HasOne(o => o.Poll)
                .WithMany(p => p.Options)
                .HasForeignKey(o => o.PollId);

            // Option-User many-to-many relationship through OptionUser
            modelBuilder.Entity<OptionUser>()
                .HasKey(ou => new { ou.OptionId, ou.UserId }); // Composite primary key

            modelBuilder.Entity<OptionUser>()
                .HasOne(ou => ou.Option)
                .WithMany(o => o.OptionUsers)
                .HasForeignKey(ou => ou.OptionId);

            modelBuilder.Entity<OptionUser>()
                .HasOne(ou => ou.User)
                .WithMany(u => u.OptionUsers)
                .HasForeignKey(ou => ou.UserId);

            // OptionId and UserId uniqueness in OptionUser
            modelBuilder.Entity<OptionUser>()
                .HasIndex(ou => new { ou.OptionId, ou.UserId })
                .IsUnique();
        }
    }

}
