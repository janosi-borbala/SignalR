import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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
        <div>
            <h2 className="mb-4">Current Polls</h2>
            {polls.length === 0 ? (
                <p className="text-muted">No polls available.</p>
            ) : (
                polls.map((poll) => (
                    <div key={poll.id} className="card mb-3">
                        <div className="card-body">
                            <Link to={`/question/${poll.id}`} className="text-decoration-none">
                                <strong>{poll.title}</strong>
                            </Link>
                            <br />
                            <Button
                                variant="danger"
                                size="sm"
                                className="mb-3 mt-3"
                                onClick={() => onDelete(poll.id)}
                            >
                                Delete
                            </Button>
                            <ul className="list-group">
                                {poll.options.map((option: Options) => (
                                    <li key={option.id} className="list-group-item">
                                        {option.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PollList;