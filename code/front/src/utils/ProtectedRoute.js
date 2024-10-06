import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, login, logout } = useAuth();
	const [loading, setLoading] = useState(true); // Add loading state to prevent premature redirection
	const authToken = Cookies.get("auth-token");
	const navigate = useNavigate();

	useEffect(() => {
		if (authToken && !isAuthenticated) {
			// If auth-token exists but isAuthenticated is false, assume user is logged in
			login(); // Set isAuthenticated to true
		} else if (!authToken) {
			// If no auth-token, user is not authenticated
			logout(); // Clear state and storage
		}
		setLoading(false); // Loading done
	}, [authToken, isAuthenticated, login, logout]);

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


	if (!authToken || !isAuthenticated) {
		// If no token or not authenticated, redirect to login
		toast.error("You must be logged in to access this page.");
		navigate("/login")
	}

	return children;
};

export default ProtectedRoute;
