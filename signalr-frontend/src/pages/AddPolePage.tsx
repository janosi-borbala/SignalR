// pages/AddPollPage.tsx
import React, { useState, useEffect } from "react";
import { signalRService } from "../services/SignalRService"; // Import the SignalR service
import PollList from "../components/PollList"; // Import PollList component

const AddPollPage: React.FC = () => {
    const [polls, setPolls] = useState<any[]>([]);
    const [pollTitle, setPollTitle] = useState("");
    const [pollOptions, setPollOptions] = useState<string[]>([""]);

    useEffect(() => {
        // Initialize the SignalR connection and set up event listeners
        signalRService.initializeConnection(
            (fetchedPolls: any[]) => {
                setPolls(fetchedPolls);
            },
            (newPoll: any) => {
                setPolls((prevPolls) => [...prevPolls, newPoll]);
            },
            (pollId: string) => {
                setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
            }
        );
    }, []);

    const handleAddOption = () => {
        setPollOptions([...pollOptions, ""]);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const handleDeletePoll = async (pollId: string) => {
        try {
            await signalRService.deletePoll(pollId);
        } catch (err) {
            console.error("Error deleting poll:", err);
        }
    };

    const handleCreatePoll = async () => {
        if (!pollTitle || pollOptions.some((option) => !option.trim())) {
            alert("Poll title and all options must be filled.");
            return;
        }

        try {
            await signalRService.createPoll(pollTitle, pollOptions, "00000000-0000-0000-0000-000000000001"); // Replace with actual userId if dynamic
            setPollTitle("");
            setPollOptions([""]);
        } catch (err) {
            console.error("Error creating poll:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Create Poll</h1>
            {/* Poll Title Input */}
            <div className="form-floating mb-4">
                <input
                    type="text"
                    className="form-control"
                    id="pollTitle"
                    placeholder="Poll Title"
                    value={pollTitle}
                    onChange={(e) => setPollTitle(e.target.value)}
                />
                <label htmlFor="pollTitle">Poll Title</label>
            </div>

            <h3>Options</h3>
            {pollOptions.map((option, index) => (
                <div key={index} className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id={`option${index}`}
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                    <label htmlFor={`option${index}`}>Option {index + 1}</label>
                </div>
            ))}

            {/* Buttons */}
            <div className="d-flex gap-2">
                <button className="btn btn-secondary" onClick={handleAddOption}>
                    Add Option
                </button>
                <button className="btn btn-primary" onClick={handleCreatePoll}>
                    Create Poll
                </button>
            </div>

            {/* Display Polls */}
            <PollList polls={polls} onDelete={handleDeletePoll} />
        </div>
    );
};

export default AddPollPage;
