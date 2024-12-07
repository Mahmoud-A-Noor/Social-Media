import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import {BrokenCirclesLoader} from "react-loaders-kit";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Show nothing (or a loader) while loading
    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <BrokenCirclesLoader loading={true} size={300} />
            </div>
        );
    }

    // Redirect to login if not authenticated
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;