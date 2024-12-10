import { FormEvent, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateUserComponent = () => {
    const [userName, setUserName] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            // handleCreateUser(userName);
            setUserName(""); // Clear the input after submission
        } else {
            alert("Name field cannot be empty!");
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Create User</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="userName"
                        placeholder="Enter name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <label htmlFor="userName">Name</label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Create User
                </button>
            </form>
        </div>
    );
};

export default CreateUserComponent;
