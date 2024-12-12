
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface NavBarProps {
    handleLogout: () => void;
}

function NavBar(props: NavBarProps) {

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarsExample02">
                    <ul className="navbar-nav mr-auto">
                        <Link to="/" className="nav-item active nav-link">Home</Link>
                    </ul>
                    <ul className="navbar-nav mr-auto">
                        <Link to="/addpoll" className="nav-item active nav-link">Add poll</Link>
                    </ul>
                    {/* <ul className="navbar-nav mr-auto">
                        <Link to="/createuser" className="nav-item active nav-link">CreateUser</Link>
                    </ul> */}
                    <ul className="navbar-nav mr-auto ml-6">
                        <Button className="nav-item active nav-link btn-danger ml-6" onClick={props.handleLogout}>Logout</Button>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default NavBar;