import { Bar } from 'react-chartjs-2';
import { Container, Row, Col, Button, Form, ButtonGroup } from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as signalR from '@microsoft/signalr';

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface QuestionOption {
    id: string;
    text: string;
}

interface Poll {
    id: string;
    title: string;
    key: string;
    options: QuestionOption[];
    createdAt: string;
    createdBy: string;
}

interface QuestionPageProps {
    polls: any[];
    votes: { [key: string]: any }[];
    handleVote: (pollId: string, optionId: string) => Promise<string>;
    handleGetVotes: (pollId: string, userId: string) => Promise<any[]>;
}

function QuestionPage({ polls, votes, handleVote, handleGetVotes }: QuestionPageProps) {
    const { pollId } = useParams();
    const poll: Poll = polls.find((poll) => poll.id === pollId);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (pollId && poll) {
            const initialAnswers = new Array(poll.options.length).fill(0);
            setAnswers(initialAnswers);
            console.log("intitial anserws", initialAnswers);
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:5000/pollhub", {
                    withCredentials: true,
                })
                .withAutomaticReconnect()
                .build();

            newConnection
                .start()
                .then(async () => {
                    console.log("Connected to SignalR Pollhub!");

                    // Fetch initial list of polls
                    const votes = await newConnection?.invoke("GetPollVotes", pollId, userId);
                    console.log("Votes:", votes);
                    if (!votes || !votes.$values) {
                        console.error("Unexpected data structure for fetchedVotes:", votes);
                        return;
                    }
                    const answ = votes.$values.map((item: any) => item.voteCount);
                    console.log("Answers:", answ);
                    setAnswers(answ);

                    newConnection?.on("VoteToggled", newVote => {
                        console.log("New Vote:", newVote);
                        setAnswers(prevAnswers => {
                            const newAnswers = [...prevAnswers];
                            const newIndex = poll.options.findIndex((opt) => opt.id === newVote.optionId);
                            if (newVote.voterAdded) {
                                newAnswers[newIndex] += 1;
                            } else {
                                newAnswers[newIndex] -= 1;
                            }
                            console.log("New Answers:", newAnswers);
                            return newAnswers;
                        });
                    });
                })
                .catch((err) => console.error("SignalR Connection Error:", err));
        }
    }, [pollId, userId, poll.options]);

    if (!poll) {
        return <div>Poll not found.</div>;
    }

    const labels = poll.options.map((opt) => opt.text);
    const data = {
        labels, // Labels for the x-axis
        datasets: [
            {
                label: 'Number of Votes',
                data: answers, // The counts for each answer
                backgroundColor: answers.map((item, index) => index % 2 === 0 ? 'rgb(160, 232, 209)' : 'rgb(242, 143, 198)'),
                borderColor: 'rgba(250, 250, 250)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows custom height/width
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Current Answers',
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
    };


    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedOption) {
            alert(`You selected: ${selectedOption}`);
            if (userId !== null) {
                handleVote(selectedOption, userId);
            }
        } else {
            alert('Please select an option!');
        }
    };

    const handleOptionClick = (optionId: string) => {
        setSelectedOption(optionId);
    };

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center vh-100">
            {/* Question */}
            <br />
            <Row className="w-100 mb-4">
                <Col className="text-center">
                    <h2>{poll.title}</h2>
                    <p>Join with {poll.key} code</p>
                </Col>
            </Row>
            {/* Multiple Choice Box */}
            <Row className="w-100 mb-4">
                <Col md={8} lg={6} className="mx-auto">
                    <Form onSubmit={onSubmit} className="p-3 border rounded bg-light">
                        <ButtonGroup vertical className="w-100 mb-3">
                            {poll?.options.map((opt) => (
                                <Button
                                    key={opt.id}
                                    variant={selectedOption === opt.id ? "primary" : "outline-primary"}
                                    className="mb-2 text-start"
                                    onClick={() => handleOptionClick(opt.id)}
                                >
                                    {opt.text}
                                </Button>
                            ))}
                        </ButtonGroup>
                        <Button type="submit" variant="success" className="w-100">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            {/* Chart */}
            <Row className="w-100" style={{ height: '100vh' }}>
                <Col className="mx-auto h-100">
                    <div className="p-3 border rounded bg-light h-100">
                        <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default QuestionPage;
