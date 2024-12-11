import * as signalR from "@microsoft/signalr";

export class UserService {
    private connection: signalR.HubConnection | null = null;

    // Initialize the SignalR connection
    public initializeConnection(): Promise<void> {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:5000/userhub", {
                withCredentials: true,
            })
            .withAutomaticReconnect()
            .build();

        return this.connection
            .start()
            .then(async () => {
                console.log("Connected to SignalR UserHub!");
            })
            .catch((err) => console.error("SignalR Connection Error:", err));
    }

    // Create a poll
    public createUser(username: string): Promise<void> {
        if (this.connection) {
            return this.connection.invoke("RegisterUser", username);
        }
        return Promise.reject("Connection not established");
    }
}

export const userService = new UserService();
