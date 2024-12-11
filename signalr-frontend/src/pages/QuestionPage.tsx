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
import { useState } from 'react';
import { useParams } from 'react-router-dom';

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface QuestionPageProps {
    polls: any[];
    handleVote: (pollId: string, optionId: string) => void;
}

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

function QuestionPage(props: QuestionPageProps) {
    const { pollId } = useParams();
    const poll: Poll = props.polls.find((poll) => poll.id === pollId);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const answers = [12, 19, 3, 5, 2, 3];

    //const labels = answers.map((_, index) => `Option ${index + 1}`);
    const labels = poll.options.map((opt) => opt.text);
    console.log(labels);
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
            props.handleVote(selectedOption, "A8882E4E-6212-48B5-880A-4AC92A8B49FC");
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
