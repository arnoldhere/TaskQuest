import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../utils/AuthContext";
import Cookies from 'js-cookie';
import AdminNavbar from '../MenuBar/AdminNavbar';

export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = Cookies.get('auth-token');
    if (!isAuthenticated && !authToken) {
      navigate("/login", { message: "Authentication forbidden !! login required" })
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <AdminNavbar />
      ADMiN dashboard
      <Toaster />
    </>
  )
}
