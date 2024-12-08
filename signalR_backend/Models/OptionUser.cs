namespace signalR_backend.Models
{
    public class OptionUser
    {
        public Guid OptionId { get; set; }
        public Option Option { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; }

        public DateTime VotedAt { get; set; } = DateTime.UtcNow;
    }
}
