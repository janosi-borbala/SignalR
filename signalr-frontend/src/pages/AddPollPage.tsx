import { useState } from "react";
import PollList from "../components/PollList";

interface AddPollPageProps {
    handleCreatePoll: (pollTitle: string, pollOptions: string[]) => Promise<void>
    polls: any[];
    handleDeletePoll: (pollId: string) => Promise<void>;
}

function AddPollPage(props: AddPollPageProps) {
    const [pollTitle, setPollTitle] = useState("");
    const [pollOptions, setPollOptions] = useState<string[]>([""]);

    const handleAddOption = () => {
        setPollOptions([...pollOptions, ""]);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const onSubmit = async () => {
        if (!pollTitle || pollOptions.some((option) => !option.trim())) {
            alert("Poll title and all options must be filled.");
            return;
        }

        try {
            props.handleCreatePoll(pollTitle, pollOptions);
            setPollTitle("");
            setPollOptions([""]);
        } catch (err) {
            console.error("Error creating poll:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Create Poll</h1>
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

            <div className="d-flex gap-2">
                <button className="btn btn-secondary" onClick={handleAddOption}>
                    Add Option
                </button>
                <button className="btn btn-primary" onClick={onSubmit}>
                    Create Poll
                </button>
            </div>
            <PollList polls={props.polls} onDelete={props.handleDeletePoll} />
        </div>
    );
};

export default AddPollPage;
