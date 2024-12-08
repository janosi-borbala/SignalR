import { Bar } from 'react-chartjs-2';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
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

// Register the Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function QuestionPage() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const opt = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    const answers = [12, 19, 3, 5, 2, 3];

    const labels = answers.map((_, index) => `Option ${index + 1}`);

    const data = {
        labels, // Labels for the x-axis
        datasets: [
            {
                label: 'Number of Votes',
                data: answers, // The counts for each answer
                backgroundColor: 'rgb(242, 143, 198)',
                borderColor: 'rgba(242, 143, 198)',
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

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (selectedOption) {
            alert(`You selected: ${selectedOption}`);
            // Handle answer submission logic here
        } else {
            alert('Please select an option!');
        }
    };

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center vh-100">
            {/* Question */}
            <Row className="w-100 mb-4">
                <Col className="text-center">
                    <h2>This is a placeholder question</h2>
                </Col>
            </Row>
            {/* Multiple Choice Box */}
            <Row className="w-100 mb-4">
                <Col md={8} lg={6} className="mx-auto">
                    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
                        {opt.map((option, index) => (
                            <Form.Check
                                inline
                                label={option} // Display the option text
                                name={`option-${index}`} // Ensure each checkbox has a unique name
                                type="checkbox" // Ensure this is set to "checkbox"
                                id={index.toString()}
                                onChange={handleOptionChange}
                            />
                        ))}
                        <Button type="submit" variant="primary" className="w-100">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            {/* Chart */}
            <Row className="w-100" style={{ height: '65vh' }}>
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
