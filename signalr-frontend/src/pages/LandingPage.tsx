import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

function LandingPage() {
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
            </Container>
        </div>
    );
};

export default LandingPage;