﻿namespace signalR_backend.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public List<OptionUser> OptionUsers { get; set; } = new();
    }
}
