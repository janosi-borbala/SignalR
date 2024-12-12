import { Container, Row } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import Switch from "react-bootstrap/esm/Switch";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../components/NavBar";
import LandingPage from "./LandingPage";
import QuestionPage from "./QuestionPage";
import AddPollPage from "./AddPollPage";
import CreateUserComponent from "../components/CreateUserComponent";
import { useEffect, useState } from "react";
import { pollService } from "../services/pollService";
import { userService } from "../services/userService";

function ApplicationRouter() {
    const [polls, setPolls] = useState<any[]>([]);
    const [votes, setVotes] = useState<any[]>([]);
    const [selectedPollId, setSelectedPollId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));

    const getUserId = (): string | null => {
        return localStorage.getItem('userId');
    };
    //setUserId(getUserId());

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
            setUserId(getUserId());
            if (userId) {
                await pollService.createPoll(pollTitle, pollOptions, userId); // Replace with actual userId if dynamic
            } else {
                console.error("User ID is null. Cannot create poll.");
            }
        } catch (err) {
            console.error("Error creating poll:", err);
        }
    };

    // A function to save the user ID to localStorage
    const saveUserId = (userId: string): void => {
        localStorage.setItem('userId', userId);
        setUserId(userId);
    };



    const handleCreateUser = async (userName: string): Promise<string> => {
        try {
            const u = await userService.createUser(userName);
            console.log(u);
            saveUserId(u);
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

    //const userId = getUserId();

    return (
        <BrowserRouter>
            <Container fluid style={{ height: "100%" }}>
                <Row>
                    <NavBar />
                </Row>
                <Row id="sb-menu-row" >
                    <Switch className="d-flex flex-column align-items-center justify-content-center">
                        <Routes>
                            {/* <Route path="/" element={
                                <LandingPage
                                    polls={polls}
                                    handleDeletePoll={handleDeletePoll}
                                />}
                            /> */}
                            <Route path="/" element={userId ? (
                                <LandingPage polls={polls} handleDeletePoll={handleDeletePoll} />
                            ) : (
                                <Navigate to="/createuser" />
                            )} />
                            {/* <Route path="/question/:pollId" element={
                                <QuestionPage
                                    polls={polls}
                                    votes={votes}
                                    handleVote={handleVote}
                                    handleGetVotes={handleGetVotes}
                                />}
                            /> */}
                            <Route path="/question/:pollId" element={userId ? (
                                <QuestionPage
                                    polls={polls}
                                    votes={votes}
                                    handleVote={handleVote}
                                    handleGetVotes={handleGetVotes}
                                />
                            ) : (
                                <Navigate to="/createuser" />
                            )} />
                            {/* <Route path="/addpole/" element={
                                <AddPolePage
                                    handleCreatePoll={handleCreatePoll}
                                    polls={polls}
                                    handleDeletePoll={handleDeletePoll}
                                />
                            }
                            /> */}
                            <Route path="/addpole" element={userId ? (
                                <AddPollPage
                                    handleCreatePoll={handleCreatePoll}
                                    polls={polls}
                                    handleDeletePoll={handleDeletePoll} />
                            ) : (
                                <Navigate to="/createuser" />
                            )} />
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