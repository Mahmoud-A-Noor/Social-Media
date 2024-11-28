import { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            getAndSetMyData()
        }
        setLoading(false);
    }, []);

    const login = (tokens) => {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
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

        setIsAuthenticated(true)
    }


    return (
        <AuthContext.Provider value={{ loading, isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);