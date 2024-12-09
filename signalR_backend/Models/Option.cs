namespace signalR_backend.Models
{
    public class Option
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Text { get; set; }
        public Guid PollId { get; set; }
        public Poll Poll { get; set; }
        public List<OptionUser> OptionUsers { get; set; } = new();
    }
}
