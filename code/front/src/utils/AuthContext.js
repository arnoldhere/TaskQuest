import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authToken = Cookies.get('auth-token');
        if (authToken) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('login', true);
    };

    const logout = async() => {
        setIsAuthenticated(false);
        const email = Cookies.get('email');
        const res = await axios.post('http://localhost:3333/logout', { email });
        if (res.status === 201) {
            localStorage.removeItem('login');
            localStorage.removeItem('user');
            localStorage.removeItem('username');
            Cookies.remove('auth-token');
            Cookies.remove("email");
            // toast.success(res.data.message);
        } else {
            toast.error("Try again ! Can't log out");
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export the useAuth function here
export const useAuth = () => {
    return useContext(AuthContext);
};
