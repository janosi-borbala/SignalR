using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using signalR_backend.Data;
using signalR_backend.Models;

namespace signalR_backend.Hubs
{
    public class PollHub : Hub
    {
        private readonly AppDbContext _dbContext;

        public PollHub(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreatePoll(string title, List<string> options, Guid userId)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                throw new HubException("Title is required.");
            }

            if (options == null || options.Count < 2)
            {
                throw new HubException("At least two options are required.");
            }

            var poll = new Poll
            {
                Title = title,
                CreatedBy = userId,
                Options = options.Select(optionText => new Option
                {
                    Text = optionText
                }).ToList()
            };

            _dbContext.Polls.Add(poll);
            await _dbContext.SaveChangesAsync();

            var pollDto = new
            {
                poll.Id,
                poll.Title,
                Options = poll.Options.Select(o => new { o.Id, o.Text }).ToList()
            };

            await Clients.All.SendAsync("PollCreated", pollDto);
        }


        public async Task<List<Poll>> GetPolls()
        {
            return await _dbContext.Polls
                .Include(p => p.Options)
                .ThenInclude(o => o.OptionUsers)
                .ThenInclude(ou => ou.User)
                .ToListAsync();
        }

        public async Task DeletePoll(string pollId)
        {
            var poll = await _dbContext.Polls
                .Include(p => p.Options)
                .ThenInclude(o => o.OptionUsers)
                .FirstOrDefaultAsync(p => p.Id == pollId);

            if (poll == null)
            {
                throw new HubException("Poll not found.");
            }

            _dbContext.Polls.Remove(poll);
            await _dbContext.SaveChangesAsync();

            await Clients.All.SendAsync("PollDeleted", pollId);
        }
    }
}