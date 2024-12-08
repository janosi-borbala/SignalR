namespace signalR_backend.Models
{
    public class Poll
    {
        public string Id { get; set; } = GeneratePollId();
        public string Title { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<Option> Options { get; set; } = new();

        private static string GeneratePollId()
        {
            const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            return new string(Enumerable.Repeat(chars, 8)
                .Select(s => s[new Random().Next(s.Length)]).ToArray());
        }
    }
}
