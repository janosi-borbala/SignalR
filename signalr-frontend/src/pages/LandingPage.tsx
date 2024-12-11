import { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import PollList from "../components/PollList";

interface LandingPageInterface {
    polls: any[];
    handleDeletePoll: (pollId: string) => Promise<void>
}

function LandingPage(props: LandingPageInterface) {
    const [quizCode, setQuizCode] = useState<string>("");

    const handleJoinQuiz = () => {
        if (quizCode.trim() === "") {
            alert("Please enter a code to join the quiz.");
        } else {
            // Redirect or handle code submission
            console.log(`Joining quiz with code: ${quizCode}`);
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
