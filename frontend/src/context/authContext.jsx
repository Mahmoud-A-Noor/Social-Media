import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsAuthenticated(true)
            getAndSetMyData()
        }
    }, []);

    const login = (tokens) => {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        setIsAuthenticated(true)
        getAndSetMyData()
        window.location.href = '/';
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false)
        setUser(null);
        window.location.href = '/login';
    };

    const getAndSetMyData = async () => {
        axiosInstance.get('/user/me')
            .then(response => setUser(response.data))
            .catch(error => console.error("Failed to fetch user data", error));
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);