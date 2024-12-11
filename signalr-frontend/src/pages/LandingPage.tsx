import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import PollList from "../components/PollList";
import { useNavigate } from "react-router-dom";

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

interface LandingPageInterface {
    polls: Poll[];
    handleDeletePoll: (pollId: string) => Promise<void>
}

function LandingPage(props: LandingPageInterface) {
    const [quizCode, setQuizCode] = useState<string>("");
    const navigate = useNavigate();

    const handleJoinQuiz = () => {
        const code: string = quizCode.trim();
        if (code === "") {
            alert("Please enter a code to join the quiz.");
        } else {
            // Redirect or handle code submission
            console.log(`Joining quiz with code: ${quizCode}`);
            const poll = props.polls.find(p => p.key === code);
            if (poll) {
                // Navigate to the question form for the selected poll
                navigate(`/question/${poll.id}`);
            } else {
                alert("No poll found with the given code.");
            }
        }
    };

    return (
        <Container fluid className="vh-100 d-flex flex-column">
            <Row className="py-4">
                <Col>
                    <h1 className="text-center">Welcome to QuizMaster</h1>
                    <p className="text-center">Enter the code below to join a quiz</p>
                </Col>
            </Row>
            <Row className="justify-content-center mb-4">
                <Col md={6}>
                    <Form>
                        <Form.Group controlId="quizCodeInput" className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter Quiz Code"
                                value={quizCode}
                                onChange={(e) => setQuizCode(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" className="w-100" onClick={handleJoinQuiz}>
                            Join Quiz
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row className="flex-grow-1">
                <Col md={{ span: 8, offset: 2 }} className="d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto border rounded p-3 bg-light">
                        <PollList polls={props.polls} onDelete={props.handleDeletePoll} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LandingPage;
