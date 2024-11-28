import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserStatus = ({ userId }) => {
    const [status, setStatus] = useState('');

    useEffect(() => {
        axios.get(`/user/status/${userId}`)
            .then(response => setStatus(response.data.status))
            .catch(error => console.error('Error fetching user status:', error));
    }, [userId]);

    return <div>User is currently: {status}</div>;
};

export default UserStatus;