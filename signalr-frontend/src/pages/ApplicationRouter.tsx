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

    useEffect(() => {
        pollService.initializeConnection(
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
            var s = await userService.createUser(userName);
            console.log(s)
            return "User created successfully!";
        } catch (err) {
            console.error("Error creating user:", err);
            return "Failed to create user. Please try again.";
        }
    };

    return (
        <BrowserRouter>
            <Container fluid style={{ height: "100%" }}>
                <Row>
                    <NavBar />
                </Row>
                <Row id="sb-menu-row" >
                    <Switch className="d-flex flex-column align-items-center justify-content-center">
                        <Routes>
                            <Route path="/" element={<LandingPage polls={polls} handleDeletePoll={handleDeletePoll} />} />
                            <Route path="/quiz/" element={<QuestionPage />} />
                            <Route path="/addpole/" element={<AddPolePage handleCreatePoll={handleCreatePoll} polls={polls} handleDeletePoll={handleDeletePoll} />} />
                            <Route path="/createuser/" element={<CreateUserComponent handleCreateUser={handleCreateUser} />} />
                        </Routes>
                    </Switch>
                </Row>

            </Container>
        </BrowserRouter>
    );
}
export default ApplicationRouter;