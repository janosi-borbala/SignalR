import { Link } from "react-router-dom";

function NavBar() {
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
                        <Link to="/addpole" className="nav-item active nav-link">Add pole</Link>
                    </ul>
                    <ul className="navbar-nav mr-auto">
                        <Link to="/createuser" className="nav-item active nav-link">CreateUser</Link>
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default NavBar;