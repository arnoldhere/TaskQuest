import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, login, logout } = useAuth();
	const [loading, setLoading] = useState(true);
	const authToken = Cookies.get("auth-token");
	const navigate = useNavigate();

	useEffect(() => {
		if (authToken) {
			// If auth-token exists and isAuthenticated is false, assume user is logged in
			if (!isAuthenticated) {
				login(); // Set isAuthenticated to true
			}
		} else {
			// If no auth-token, user is not authenticated
			logout(); // Clear state and storage
		}
		setLoading(false); // Loading done
	}, [authToken, isAuthenticated, login, logout]);

	// While loading, show a spinner or similar
	if (loading) {
		return (
			<div
				className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
				role="status"
			>
				<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
					Loading...
				</span>
			</div>
		);
	}

	// Redirect logic only after loading is complete
	if (!isAuthenticated) {
		// If not authenticated, redirect to login
		toast.error("You must be logged in to access this page.");
		navigate("/login"); // Make sure this path matches your routes
		return null; // Return null to prevent rendering of children
	}

	return children; // Render children if authenticated
};

export default ProtectedRoute;
