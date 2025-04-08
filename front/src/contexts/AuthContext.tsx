import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
    username: string;
    email: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const apiUri = import.meta.env.VITE_API_URI;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${apiUri}/auth/me`, {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await axios.post(`${apiUri}/auth/logout`, {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
