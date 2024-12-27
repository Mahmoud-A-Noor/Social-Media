import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/authContext.jsx";

export default function Success() {
    const { getAndSetMyData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if tokens are already stored
        let accessToken = localStorage.getItem('accessToken');
        let refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
            // Capture tokens from URL query params if not already stored
            const urlParams = new URLSearchParams(window.location.search);
            accessToken = urlParams.get('accessToken');
            refreshToken = urlParams.get('refreshToken');

            if (accessToken && refreshToken) {
                // Store tokens in localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
            } else {
                console.error("Error: Tokens are missing in the URL.");
                navigate('/login'); // Redirect to login page if tokens are not found
                return;
            }
        }

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        // Use tokens to fetch user data
        getAndSetMyData();

        // Navigate to the main page
        navigate('/');
    }, [navigate]);

    return <></>;
}