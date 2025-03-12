import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState<string | null>(location.state?.successMessage || null);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div>
            <div className="d-flex justify-content-center">
                {successMessage && (
                    <div className="alert alert-success">
                        {successMessage}
                    </div>
                )}
            </div>
            <p>Ça marche, bienvenue !</p>
        </div>
    );
}

export default Home;
