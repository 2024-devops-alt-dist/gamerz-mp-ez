import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "../components/Chat";

type User = {
    _id: string;
    username: string;
    email: string;
};

function Home() {
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.successMessage || null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/v1/auth/me", {
                    withCredentials: true,
                });
                setUser(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-center">
                {successMessage && (
                    <div className="alert alert-success">
                        {successMessage}
                    </div>
                )}
            </div>
            {/* <p>Ça marche, bienvenue {user?.username} !</p> */} 

            {user && <Chat user={user} />}
        </div>
    );
}

export default Home;