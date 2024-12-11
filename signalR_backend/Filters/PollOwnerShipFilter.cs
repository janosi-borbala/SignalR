using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using signalR_backend.Data;
using signalR_backend.Hubs;

public class PollOwnershipFilter : IHubFilter
{
    private readonly AppDbContext _dbContext;

    public PollOwnershipFilter(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async ValueTask<object?> InvokeMethodAsync(HubInvocationContext context, Func<HubInvocationContext, ValueTask<object?>> next)
    {
        if (context.HubMethodName == nameof(PollHub.GetPollVotes))
        {
            var pollId = (Guid)context.HubMethodArguments[0];
            var userId = (Guid)context.HubMethodArguments[1];

            var poll = await _dbContext.Polls.FirstOrDefaultAsync(p => p.Id == pollId);
            if (poll == null)
            {
                throw new HubException("Poll not found.");
            }

            var pollHub = (PollHub)context.Hub;
            pollHub.IsOwner = poll.CreatedBy == userId;
        }

        return await next(context);
    }
}
