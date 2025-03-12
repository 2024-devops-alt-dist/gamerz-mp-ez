import RegisterForm from "../components/RegisterForm";

function Register() {
    return (
        <div className="container mt-5">
            <div className="row home-infos">
                <div className="col-12 text-center">
                    <h1 className="mb-4">🎮 Bienvenue sur Gamerz !</h1>
                    <p className="lead">Vous cherchez des coéquipiers pour vos jeux préférés
                        ? <strong>Gamerz</strong> est une plateforme privée où les joueurs peuvent discuter et
                        trouver des partenaires en quelques clics.</p>

                    <div className="mt-4">
                        <h3>💬 Des salons de discussion dédiés</h3>
                        <p>Chaque jeu possède son propre salon pour échanger en temps réel et organiser vos
                            parties.</p>
                    </div>

                    <div className="mt-4">
                        <h3>✅ Une communauté sécurisée</h3>
                        <p>Chaque joueur doit soumettre une <strong>candidature motivée</strong> et être validé par
                            un administrateur avant d’accéder aux salons.</p>
                    </div>

                    <div className="mt-4">
                        <h3>🚀 Comment rejoindre Gamerz ?</h3>
                            <p><strong>1. Inscrivez-vous</strong> et expliquez pourquoi vous voulez faire partie de la
                                communauté.
                            </p>
                            <p><strong>2. Attendez la validation</strong> par un administrateur.</p>
                            <p><strong>3. Accédez aux salons</strong> et trouvez des joueurs en un instant !</p>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center">
                <RegisterForm/>
            </div>

        </div>
    );
}

export default Register;
