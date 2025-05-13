import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";

function Header() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirm = window.confirm("Es-tu sûr de vouloir te déconnecter ?");

        if (!confirm) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URI}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };


    return (
        <nav className="navbar navbar-expand-lg mb-5">
            <div className="container-fluid">
                <NavLink to="/home" className="navbar-brand fs-3 m-0 text-light">Gamerz</NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <div className="navbar-nav">
                        {!user && (
                            <>
                                <NavLink to="/register" className="nav-link text-light">Inscription</NavLink>
                                <NavLink to="/login" className="nav-link text-light">Connexion</NavLink>
                            </>
                        )}

                        {user && (
                            <>
                                {user.roles?.includes("ROLE_ADMIN") && (
                                    <NavLink to="/admin/applications" className="nav-link text-light">Dashboard</NavLink>
                                )}
                                <NavLink to="/home" className="nav-link text-light">Chat</NavLink>
                                <button className="btn btn-link nav-link text-light" onClick={handleLogout}>
                                    Déconnexion de <span>{user.username}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;