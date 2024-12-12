import { FormEvent, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

interface CreateUserComponentProps {
    handleCreateUser: (username: string) => Promise<string>;
}

const CreateUserComponent = (props: CreateUserComponentProps) => {
    const [userName, setUserName] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!userName.trim()) {
            setStatusMessage("Name field cannot be empty!");
            return;
        }

        setIsSubmitting(true); // Start the loading state
        const feedback = await props.handleCreateUser(userName);
        setStatusMessage(feedback); // Update feedback message
        setUserName(""); // Clear the input after submission
        setIsSubmitting(false); // End the loading state

        if (feedback.startsWith("User created successfully")) {
            // Navigate to a new route if user creation is successful
            navigate("/"); // Replace "/new-user" with the desired route
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
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting} // Disable button during submission
                >
                    {isSubmitting ? "Creating..." : "Create User"}
                </button>
            </form>
            {statusMessage && (
                <div
                    className={`alert mt-3 ${statusMessage.startsWith("Failed")
                        ? "alert-danger"
                        : "alert-success"
                        }`}
                    role="alert"
                >
                    {statusMessage}
                </div>
            )}

        </div>
    );
};

export default CreateUserComponent;
