import React from "react";
import Menubar from "./MenuBar/Navbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import LandingPage from "../component/LandingPage";
import Footer from "../component/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import Cookies from 'js-cookie';
import { Toaster } from "react-hot-toast";

function UserLayout() {
	const isLogin = localStorage.getItem('user');
	const [loading, setLoading] = useState(true);
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	useEffect(() => {
		const authToken = Cookies.get('auth-token');
		if (isAuthenticated && authToken) {
			navigate('/home');
		}
	}, [isAuthenticated, navigate]);


	useEffect(() => {
		// Simulating loading state if needed, can remove if unnecessary
		setLoading(false);
	}, []);

	if (loading) {
		<div
			className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
			role="status"
		>
			<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
				Loading...
			</span>
		</div>;
	}

	return (
		<>
			<Menubar />
			{(isLogin) ? (<Outlet />) : (<LandingPage />)}
			<Footer />
			<Toaster />
		</>
	);
}

export default UserLayout;
