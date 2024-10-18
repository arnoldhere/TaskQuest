import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import LeaderProjects from "./LeaderProjects";
import Cookies from "js-cookie"

export default function LeaderDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = Cookies.get('auth-token');
    if (!isAuthenticated && !authToken) {
      navigate("/login", { message: "Authentication forbidden !! login required" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <LeaderProjects />
      <Toaster />
    </>
  );
}
