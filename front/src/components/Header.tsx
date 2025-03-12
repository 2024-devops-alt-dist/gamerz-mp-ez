import { NavLink } from "react-router";

function Header() {
    return (
        <nav className="navbar navbar-expand-lg mb-5">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand fs-3 m-0">Gamerz</NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <div className="navbar-nav">
                        <NavLink to="/register" className="nav-link">Inscription</NavLink>
                        {/*<NavLink to="/brewery" className="nav-link">Les brasseries</NavLink>*/}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
