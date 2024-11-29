import jwtDecode from "jwt-decode";

export default function getUserIdFromToken(token) {
    try {
        const decodedToken = jwtDecode(token); // Decodes the JWT
        return decodedToken.id || decodedToken.sub; // Adjust based on your backend's claim for the user ID
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};