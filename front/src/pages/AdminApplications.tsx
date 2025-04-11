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

type Topic = {
    _id: string;
    name: string;
};

function AdminDashboard() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [gamerz, setGamerz] = useState<GamerzUser[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [newTopic, setNewTopic] = useState("");

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

    const fetchTopics = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/v1/admin/topics", {
                withCredentials: true,
            });
            setTopics(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des topics :", error);
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

    const handleCreateTopic = async () => {
        if (!newTopic.trim()) return;

        try {
            await axios.post("http://localhost:5000/api/v1/admin/topics", { name: newTopic }, {
                withCredentials: true
            });
            setNewTopic("");
            fetchTopics();
        } catch (error) {
            console.error("Erreur lors de la création du topic :", error);
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/v1/admin/topics/${topicId}`, {
                withCredentials: true
            });
            fetchTopics();
        } catch (error) {
            console.error("Erreur lors de la suppression du topic :", error);
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchGamerz();
        fetchTopics();
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

            {/* Topic Management */}
            <div className="row mt-5">
                <div className="col-12">
                    <h2>Gestion des topics</h2>

                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nom du nouveau topic"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleCreateTopic}>Créer</button>
                    </div>

                    {topics.length === 0 ? (
                        <p>Aucun topic existant.</p>
                    ) : (
                        <ul className="list-group">
                            {topics.map((topic) => (
                                <li key={topic._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {topic.name}
                                    <button onClick={() => handleDeleteTopic(topic._id)} className="btn btn-danger btn-sm">Supprimer</button>
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
