using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using signalR_backend.Data;
using signalR_backend.Models;

namespace signalR_backend.Hubs
{
    public class PollHub : Hub
    {
        public bool IsOwner { get; set; } = false;

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
                Key = Guid.NewGuid().ToString("N").Substring(0, 6),
                Options = options.Select(optionText => new Option
                {
                    Text = optionText
                }).ToList()
            };

            _dbContext.Polls.Add(poll);
            await _dbContext.SaveChangesAsync();

            await Clients.All.SendAsync("PollCreated", poll);
        }

        public async Task<List<Poll>> GetPolls()
        {
            return await _dbContext.Polls
                .Include(p => p.Options)
                .ThenInclude(o => o.OptionUsers)
                .ThenInclude(ou => ou.User)
                .ToListAsync();
        }

        public async Task DeletePoll(Guid pollId)
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

        public async Task Vote(Guid optionId, Guid userId)
        {
            var option = await _dbContext.Options
                .Include(o => o.Poll)
                .FirstOrDefaultAsync(o => o.Id == optionId);

            if (option == null)
            {
                throw new HubException("Option not found.");
            }

            var existingVote = await _dbContext.OptionUsers
                .FirstOrDefaultAsync(ou => ou.OptionId == optionId && ou.UserId == userId);

            if (existingVote != null)
            {
                _dbContext.OptionUsers.Remove(existingVote);
                await _dbContext.SaveChangesAsync();

                var voteCount = await _dbContext.OptionUsers
                    .CountAsync(ou => ou.OptionId == optionId);

                await Clients.All.SendAsync("VoteToggled", new
                {
                    OptionId = optionId,
                    VoteCount = voteCount,
                    VoterRemoved = new { userId }
                });

                return;
            }

            var vote = new OptionUser
            {
                OptionId = optionId,
                UserId = userId
            };

            _dbContext.OptionUsers.Add(vote);
            await _dbContext.SaveChangesAsync();

            var updatedVoteCount = await _dbContext.OptionUsers
                .CountAsync(ou => ou.OptionId == optionId);

            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new HubException("User not found.");
            }

            await Clients.All.SendAsync("VoteToggled", new
            {
                OptionId = optionId,
                VoteCount = updatedVoteCount,
                VoterAdded = new
                {
                    user.Id,
                    user.Name
                }
            });
        }

        public async Task<object> GetPollVotes(Guid pollId, Guid userId)
        {
            var poll = await _dbContext.Polls
                .Include(p => p.Options)
                .ThenInclude(o => o.OptionUsers)
                .ThenInclude(ou => ou.User)
                .FirstOrDefaultAsync(p => p.Id == pollId);

            if (poll == null)
            {
                throw new HubException("Poll not found.");
            }

            if (IsOwner)
            {
                return poll.Options.Select(option => new
                {
                    OptionId = option.Id,
                    OptionText = option.Text,
                    Votes = option.OptionUsers.Select(ou => new
                    {
                        UserId = ou.UserId,
                        UserName = ou.User.Name,
                        VotedAt = ou.VotedAt
                    }).ToList()
                }).ToList();
            }
            else
            {
                return poll.Options.Select(option => new
                {
                    OptionId = option.Id,
                    OptionText = option.Text,
                    VoteCount = option.OptionUsers.Count
                }).ToList();
            }
        }
    }
}