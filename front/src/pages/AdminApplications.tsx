import { useEffect, useState } from "react";
import axios from "axios";

type Application = {
    _id: string;
    userId: string;
    username: string;
    email: string;
    content: string;
};

function AdminApplications() {
    const [applications, setApplications] = useState<Application[]>([]);

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

    const handleDecision = async (userId: string, action: "accept" | "reject") => {
        try {
            await axios.post(`http://localhost:5000/api/v1/admin/applications/${userId}/${action}`, {}, {
                withCredentials: true
            });
            fetchApplications(); // Rafraichi
        } catch (error) {
            console.error(`Erreur lors de la ${action} de la candidature :`, error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div className="container mt-4">
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
    );
}

export default AdminApplications;
