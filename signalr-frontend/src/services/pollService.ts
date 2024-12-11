import * as signalR from "@microsoft/signalr";

export class PollService {
    private connection: signalR.HubConnection | null = null;

    // Initialize the SignalR connection
    public initializeConnection(
        onPollsFetched: (polls: any[]) => void,
        onPollCreated: (newPoll: any) => void,
        onPollDeleted: (pollId: string) => void
    ): Promise<void> {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:5000/pollhub", {
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .build();

        return this.connection
            .start()
            .then(async () => {
                console.log("Connected to SignalR Pollhub!");

                // Fetch initial list of polls
                const fetchedPolls = await this.connection?.invoke("GetPolls");
                if (!fetchedPolls || !fetchedPolls.$values) {
                    console.error("Unexpected data structure for fetchedPolls:", fetchedPolls);
                    return;
                }

                const normalizedPolls = fetchedPolls.$values.map((poll: any) => ({
                    id: poll.id,
                    key: poll.key,
                    title: poll.title,
                    createdBy: poll.createdBy,
                    createdAt: poll.createdAt,
                    options: (poll.options?.$values || []).map((option: any) => ({
                        id: option.id,
                        text: option.text,
                    })),
                }));

                onPollsFetched(normalizedPolls);

                // Listen for new polls
                this.connection?.on("PollCreated", (newPoll) => {
                    const normalizedPoll = {
                        id: newPoll.id,
                        key: newPoll.key,
                        title: newPoll.title,
                        createdBy: newPoll.createdBy,
                        createdAt: newPoll.createdAt,
                        options: (newPoll.options?.$values || []).map((option: any) => ({
                            id: option.id,
                            text: option.text,
                        })),
                    };

                    onPollCreated(normalizedPoll);
                });

                // Listen for poll deletion
                this.connection?.on("PollDeleted", (pollId) => {
                    onPollDeleted(pollId);
                });
            })
            .catch((err) => console.error("SignalR Connection Error:", err));
    }

    // Delete a poll
    public deletePoll(pollId: string): Promise<void> {
        if (this.connection) {
            return this.connection.invoke("DeletePoll", pollId);
        }
        return Promise.reject("Connection not established");
    }

    // Create a poll
    public createPoll(title: string, options: string[], userId: string): Promise<void> {
        if (this.connection) {
            return this.connection.invoke("CreatePoll", title, options, userId);
        }
        return Promise.reject("Connection not established");
    }
}

export const pollService = new PollService();
