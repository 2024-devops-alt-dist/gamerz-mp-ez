import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Chargement...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !user.roles?.includes(requiredRole)) {
        return <Navigate to="/home" />;
    }

    return children;
};

export default ProtectedRoute;
