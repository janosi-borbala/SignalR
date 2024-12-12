import { Container, Row } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import Switch from "react-bootstrap/esm/Switch";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../components/NavBar";
import LandingPage from "./LandingPage";
import QuestionPage from "./QuestionPage";
import AddPolePage from "./AddPollPage";
import CreateUserComponent from "../components/CreateUserComponent";
import { useEffect, useState } from "react";
import { pollService } from "../services/pollService";
import { userService } from "../services/userService";

function ApplicationRouter() {
    const [polls, setPolls] = useState<any[]>([]);
    const [votes, setVotes] = useState<any[]>([]);
    const [selectedPollId, setSelectedPollId] = useState<string | null>(null);

    useEffect(() => {
        pollService.initializeConnection(
            (fetchedPolls: any[]) => {
                setPolls(fetchedPolls);
                //console.log(fetchedPolls);
            },
            (newPoll: any) => {
                setPolls((prevPolls) => [...prevPolls, newPoll]);
            },
            (pollId: string) => {
                setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
            }
        );
        userService.initializeConnection();
    }, []);

    const handleDeletePoll = async (pollId: string) => {
        try {
            await pollService.deletePoll(pollId);
        } catch (err) {
            console.error("Error deleting poll:", err);
        }
    };

    const handleCreatePoll = async (pollTitle: string, pollOptions: string[]) => {
        try {
            await pollService.createPoll(pollTitle, pollOptions, "00000000-0000-0000-0000-000000000001"); // Replace with actual userId if dynamic
        } catch (err) {
            console.error("Error creating poll:", err);
        }
    };

    const handleCreateUser = async (userName: string): Promise<string> => {
        try {
            await userService.createUser(userName);
            return "User created successfully!";
        } catch (err) {
            console.error("Error creating user:", err);
            return "Failed to create user. Please try again.";
        }
    };

    const handleGetVotes = async (pollId: string, userId: string) => {
        try {
            const fetchedVotes = await pollService.getPollVotes(pollId, userId);
            setVotes(fetchedVotes);
            setSelectedPollId(pollId);
            return fetchedVotes.$values;
        } catch (err) {
            console.error("Error fetching votes:", err);
        }
    };

    const handleVote = async (pollId: string, optionId: string) => {
        try {
            await pollService.vote(pollId, optionId);
            return "Vote submitted successfully!";
        } catch (err) {
            console.error("Error submitting vote:", err);
            return "Failed to submit vote. Please try again.";
        }
    }

    return (
        <BrowserRouter>
            <Container fluid style={{ height: "100%" }}>
                <Row>
                    <NavBar />
                </Row>
                <Row id="sb-menu-row" >
                    <Switch className="d-flex flex-column align-items-center justify-content-center">
                        <Routes>
                            <Route path="/" element={
                                <LandingPage
                                    polls={polls}
                                    handleDeletePoll={handleDeletePoll}
                                />}
                            />
                            <Route path="/question/:pollId" element={
                                <QuestionPage
                                    polls={polls}
                                    votes={votes}
                                    handleVote={handleVote}
                                    handleGetVotes={handleGetVotes}
                                />}
                            />
                            <Route path="/addpole/" element={
                                <AddPolePage
                                    handleCreatePoll={handleCreatePoll}
                                    polls={polls}
                                    handleDeletePoll={handleDeletePoll}
                                />
                            }
                            />
                            <Route path="/createuser/" element={
                                <CreateUserComponent
                                    handleCreateUser={handleCreateUser}
                                />}
                            />
                        </Routes>
                    </Switch>
                </Row>

            </Container>
        </BrowserRouter>
    );
}
export default ApplicationRouter;