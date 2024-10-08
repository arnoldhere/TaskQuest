import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "./MenuBar/AdminNavbar";
import Footer from "../component/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import Cookies from 'js-cookie';
import toast, { Toaster } from "react-hot-toast";
import AdminLanding from "./AdminLanding";
import Loader from "./Loader";

function LeaderLayout() {
	// const isLogin = localStorage.getItem('user');
	const [loading, setLoading] = useState(true);
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
		if (!isAuthenticated && !authToken) {
			// navigate('/admin/dashboard');
			navigate('/login');
		}
	}, [isAuthenticated, navigate]);


	useEffect(() => {
		// Simulating loading state if needed, can remove if unnecessary
		setLoading(false);
	}, []);

	if (loading) {
		<Loader />
	}

	return (
		<>
			{(isLogin) ? (
				<>
					<AdminNavbar />
					<Outlet />
				</>
			) : (< AdminLanding />)}
			<Toaster />
		</>
	);
}

export default LeaderLayout;
