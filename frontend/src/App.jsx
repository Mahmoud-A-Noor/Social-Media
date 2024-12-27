import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom"
import Home from "./pages/home/page"
import Login from "./pages/auth/login/Login.jsx"
import Register from "./pages/auth/register/Register.jsx"
import Profile from "./pages/profile/Profile.jsx"
import NotFound from "./pages/404/page"
import LiveStreamPage from "./components/LiveStream/LiveStreamPage";

import { AuthProvider } from './context/authContext.jsx';
import PrivateRoute from "./components/Route/PrivateRoute.jsx";
import socketService from './config/socket';
import Post from "./pages/Post/Post.jsx";
import Success from "./pages/auth/Success.jsx";



function App() {
    useEffect(() => {
        // Connect to socket when app loads
        socketService.connect();

        // Cleanup on unmount
        return () => {
            socketService.disconnect();
        };
    }, []);

    return (
        <>
            <AuthProvider>
                <Routes>
                    <Route exact path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/success" element={<Success />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/live/:streamerId" element={<PrivateRoute><LiveStreamPage /></PrivateRoute>} />
                    <Route path="/post/:postId" element={<PrivateRoute><Post /></PrivateRoute>} />
                    <Route path="/profile/:profileId" element={<PrivateRoute><Profile/></PrivateRoute>}/>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </>
    )
}

export default App
