import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {JSX} from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Chargement...</div>;

    return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
