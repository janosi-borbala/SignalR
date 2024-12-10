import React from "react";

interface PollListProps {
    polls: any[];
    onDelete: (pollId: string) => void;
}

interface Options {
    id: string;
    text: string;
}

const PollList: React.FC<PollListProps> = ({ polls, onDelete }) => {
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Current Polls</h2>
            {polls.length === 0 ? (
                <p className="text-muted">No polls available.</p>
            ) : (
                <div>
                    {polls.map((poll, index) => (
                        <div key={index} className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{poll.title}</h5>
                                <button
                                    className="btn btn-danger btn-sm mb-3"
                                    onClick={() => onDelete(poll.id)}
                                >
                                    Delete
                                </button>
                                <ul className="list-group">
                                    {poll.options.map((opt: Options) => (
                                        <li
                                            key={opt.id}
                                            className="list-group-item list-group-item-light"
                                        >
                                            {opt.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PollList;