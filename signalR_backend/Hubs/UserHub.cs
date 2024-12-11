using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using signalR_backend.Data;
using signalR_backend.Models;

namespace signalR_backend.Hubs
{
    public class UserHub : Hub
    {
        private readonly AppDbContext _context;

        public UserHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> RegisterUser(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new HubException("Username cannot be empty.");
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Name == username);
            if (existingUser != null)
            {
                return existingUser.Id.ToString();
            }

            var newUser = new User
            {
                Name = username
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser.Id.ToString();
        }
    }
}
