import React from "react";
import { Outlet } from "react-router-dom";
import LeaderNavbar from "../component/MenuBar/LeaderNavbar"
import { useNavigate } from 'react-router-dom';
import LandingPage from "../component/LandingPage";
import Footer from "../component/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import Cookies from 'js-cookie';
import toast, { Toaster } from "react-hot-toast";
import LeaderLanding from "./LeaderLanding";

function LeaderLayout() {
	// const isLogin = localStorage.getItem('user');
	// const [loading, setLoading] = useState(true);
	const { isAuthenticated } = useAuth();
	const [isLogin, setIsLogin] = useState(false); // State to track login status
	const navigate = useNavigate();

	useEffect(() => {
		// Check if the user is logged in on component mount
		const loginStatus = localStorage.getItem('login');
		setIsLogin(!!loginStatus); // Convert to boolean
	}, []);

	useEffect(() => {
		const authToken = Cookies.get('auth-token');
		if (isAuthenticated && authToken) {
			navigate('/leader/dashboard');
		}
	}, [isAuthenticated, navigate]);


	// useEffect(() => {
	// 	// Simulating loading state if needed, can remove if unnecessary
	// 	setLoading(false);
	// }, []);

	// if (loading) {
	// 	<div
	// 		className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
	// 		role="status"
	// 	>
	// 		<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
	// 			Loading...
	// 		</span>
	// 	</div>;
	// }

	return (
		<>
			{(isLogin) ? (
				<>
					<LeaderNavbar />
					<Outlet />
				</>
			) : (< LeaderLanding />)}
			<Footer />
			<Toaster />
		</>
	);
}

export default LeaderLayout;
