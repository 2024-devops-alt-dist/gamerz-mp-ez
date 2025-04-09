import { useEffect, useState } from "react";
import axios from "axios";

type Application = {
    _id: string;
    userId: string;
    username: string;
    email: string;
    content: string;
};

type GamerzUser = {
    _id: string;
    username: string;
    email: string;
};

function AdminDashboard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [gamerz, setGamerz] = useState<GamerzUser[]>([]);

    const fetchApplications = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/admin/applications", {
                withCredentials: true,
            });
            setApplications(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des candidatures :", error);
        }
    };

    const fetchGamerz = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/admin/gamerz", {
                withCredentials: true,
            });
            setGamerz(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des utilisateurs GAMERZ :", error);
        }
    };

    const handleDecision = async (userId: string, action: "accept" | "reject") => {
        try {
            await axios.post(`http://localhost:5000/api/v1/admin/applications/${userId}/${action}`, {}, {
                withCredentials: true
            });
            fetchApplications();
            fetchGamerz();
        } catch (error) {
            console.error(`Erreur lors de la ${action} de la candidature :`, error);
        }
    };

    const handleBan = async (userId: string) => {
        try {
            await axios.post(`http://localhost:5000/api/v1/admin/gamerz/${userId}/ban`, {}, {
                withCredentials: true
            });
            fetchGamerz();
        } catch (error) {
            console.error("Erreur lors du bannissement :", error);
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchGamerz();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Pending Applications */}
                <div className="col-md-6">
                    <h2>Candidatures en attente</h2>
                    {applications.length === 0 ? (
                        <p>Aucune candidature en attente.</p>
                    ) : (
                        <ul className="list-group">
                            {applications.map((app) => (
                                <li key={app._id} className="list-group-item">
                                    <strong>{app.username}</strong> ({app.email})<br />
                                    <em>{app.content}</em>
                                    <div className="mt-2">
                                        <button onClick={() => handleDecision(app.userId, "accept")} className="btn btn-success btn-sm me-2">Accepter</button>
                                        <button onClick={() => handleDecision(app.userId, "reject")} className="btn btn-danger btn-sm">Refuser</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Gamerz Users */}
                <div className="col-md-6">
                    <h2>Liste de gamerz</h2>
                    {gamerz.length === 0 ? (
                        <p>Aucun utilisateur gamerz inscrit.</p>
                    ) : (
                        <ul className="list-group">
                            {gamerz.map((user) => (
                                <li key={user._id} className="list-group-item">
                                    <strong>{user.username}</strong> ({user.email})
                                    <div className="mt-2">
                                        <button onClick={() => handleBan(user._id)} className="btn btn-warning btn-sm">Bannir</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
