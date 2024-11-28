import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Show nothing (or a loader) while loading
    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect to login if not authenticated
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;