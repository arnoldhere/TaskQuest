import "../src/css/App.css";
import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import userRoutes from "./routes/UserRoutes";
import leaderRoutes from "./routes/LeaderRoutes";
import { AuthProvider } from "./utils/AuthContext";
import { Toaster } from "react-hot-toast";
import Login from "./component/Auth/Login";
import Signup from "./component/Auth/Signup";
import ForgotPassword from "./component/Auth/ForgotPassword";
import VerifyOtp from "./component/Auth/VerifyOtp";
import UpdatePwd from "./component/Auth/UpdatePwd";
import PageNotFound from "./component/PageNotfound";
import adminRoutes from "./routes/AdminRoutes";

// Combine both user and leader routes
const routes = createBrowserRouter([
	...userRoutes,
	...leaderRoutes,
	...adminRoutes,
	// Authentication routes here
	{
		path: "/login",
		element: <Login/>,
		errorElement: <PageNotFound/>,
	},
	{
		path: "/signup",
		element: <Signup/>,
		errorElement: <PageNotFound/>,
	},
	{
		path: "/forgot",
		element: <ForgotPassword/>,
		errorElement: <PageNotFound/>,
	},
	{
		path: "/verify",
		element: <VerifyOtp/>,
		errorElement: <PageNotFound/>,
	},
	{
		path: "/updatePwd",
		element: <UpdatePwd/>,
		errorElement: <PageNotFound/>,
	},
]);

function App() {
	return (
		<>
			<AuthProvider>
				{/* <Suspense fallback={<div>Loading...</div>}> */}
					<RouterProvider router={routes} />
				{/* </Suspense> */}
				<Toaster />
			</AuthProvider>
		</>
	);
}

export default App;
