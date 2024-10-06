import { createContext, useState, useContext, useEffect } from "react";
import Cookies from 'js-cookie';
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

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('login');
        localStorage.removeItem('user');
        localStorage.removeItem('username');
        Cookies.remove('auth-token');
        Cookies.remove("email");
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
