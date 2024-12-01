import React, { useEffect, useState } from 'react';
import axiosInstance from "../config/axios.js";

const UserStatus = ({ userId }) => {
    const [status, setStatus] = useState('');

    useEffect(() => {
        axiosInstance.get(`/user/status/${userId}`)
            .then(response => setStatus(response.data.status))
            .catch(error => console.error('Error fetching user status:', error));
    }, [userId]);

    return <div>User is currently: {status}</div>;
};

export default UserStatus;