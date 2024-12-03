import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../config/axios';
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            getAndSetMyData()
        }
        setLoading(false);
    }, []);

    const login = async(userData) => {
        try{
            const response = await axiosInstance.post('/auth/login', userData);
            const { message, user, tokens } = response.data;
            // Store tokens in localStorage
            localStorage.setItem('accessToken', tokens.accessToken);
            localStorage.setItem('refreshToken', tokens.refreshToken);
            getAndSetMyData()
            navigate("/")
        }catch(error){
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            // Make API call to register user
            const {username, email, password} = userData;
            const response = await axiosInstance.post("/auth/register", userData);
            await login({email, password});
        } catch (error) {
            console.error("Registration failed:", error.response?.data || error.message);
            throw error;
        }
    };

    const logout = () => {
        try{
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsAuthenticated(false)
            setUser(null);
            window.location.href = '/login';
        }catch(error){
            console.error("Logout failed:", error.response?.data || error.message);
            throw error;
        }
    };

    const getAndSetMyData = async () => {
        axiosInstance.get('/user/me')
            .then(response => setUser(response.data))
            .catch(error =>{
                console.error("Failed to fetch user data", error)
                throw error;
            });

        setIsAuthenticated(true)
    }


    return (
        <AuthContext.Provider value={{ loading, isAuthenticated, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);