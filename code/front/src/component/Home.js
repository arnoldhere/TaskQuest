import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from "./Member/Dashboard"
import { useAuth } from "../utils/AuthContext";
import Cookies from 'js-cookie';


export default function Home() {

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = Cookies.get('auth-token');
    if (isAuthenticated && authToken) {
        navigate('/home');
    } else {
      // toast.error("Authentication forbidden !! login required");
      navigate("/login", { message: "Authentication forbidden !! login required" })
    }
  }, [isAuthenticated, navigate]);


  return (
    <div>
      <Toaster />
      <Dashboard />
    </div>
  );
}