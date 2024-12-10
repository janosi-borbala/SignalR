// LandingPage.tsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { signalRService } from "../services/SignalRService";
import PollList from "../components/PollList";

const LandingPage: React.FC = () => {
    const [quizCode, setQuizCode] = useState<string>("");
    const [polls, setPolls] = useState<any[]>([]);

    useEffect(() => {
        // Initialize the SignalR connection
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

    const handleJoinQuiz = () => {
        if (quizCode.trim() === "") {
            alert("Please enter a code to join the quiz.");
        } else {
            // Redirect or handle code submission
            console.log(`Joining quiz with code: ${quizCode}`);
        }
    };

    const handleDeletePoll = async (pollId: string) => {
        await signalRService.deletePoll(pollId);
    };

    return (
        <div>
            <Container className="vh-100 d-flex flex-column justify-content-center align-items-center">
                <Row>
                    <Col>
                        <h1 className="text-center mb-4">Welcome to QuizMaster</h1>
                        <p className="text-center mb-4">Enter the code below to join a quiz</p>
                    </Col>
                </Row>
                <Row className="w-100">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form>
                            <Form.Group controlId="quizCodeInput" className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Quiz Code"
                                    value={quizCode}
                                    onChange={(e) => setQuizCode(e.target.value)}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                className="w-100"
                                onClick={handleJoinQuiz}
                            >
                                Join Quiz
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row className="w-100">
                    <PollList polls={polls} onDelete={handleDeletePoll} />
                </Row>
            </Container>
        </div>
    );
};

export default LandingPage;
