import { Container, Row } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import Switch from "react-bootstrap/esm/Switch";
import { BrowserRouter } from "react-router-dom";
import NavBar from "../components/NavBar";
import LandingPage from "./LandingPage";
import QuestionPage from "./QuestionPage";
import AddPolePage from "./AddPolePage";
import CreateUserComponent from "../components/CreateUserComponent";

function ApplicationRouter() {
    return (
        <BrowserRouter>
            <Container fluid style={{ height: "100%" }}>
                <Row>
                    <NavBar />
                </Row>
                <Row id="sb-menu-row" >
                    <Switch className="d-flex flex-column align-items-center justify-content-center">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/quiz/" element={<QuestionPage />} />
                            <Route path="/addpole/" element={<AddPolePage />} />
                            <Route path="/createuser/" element={<CreateUserComponent />} />
                        </Routes>
                    </Switch>
                </Row>

            </Container>
        </BrowserRouter>
    );
}
export default ApplicationRouter;