import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext'; // Custom hook for authentication

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Check if the user is authenticated

    // Redirect to login if the user is not authenticated
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;