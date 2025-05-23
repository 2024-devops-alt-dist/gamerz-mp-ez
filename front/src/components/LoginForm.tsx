import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {useAuth} from "../contexts/AuthContext.tsx";

// Définition du schéma Zod pour la validation
const schema = z.object({
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
});

// Définition du type TypeScript basé sur le schéma Zod
type LoginData = z.infer<typeof schema>;

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        resolver: zodResolver(schema),
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const apiUri = import.meta.env.VITE_API_URI;
    const { setUser } = useAuth();

    const onSubmit = async (data: LoginData) => {
        try {
            const response = await axios.post(`${apiUri}/auth/login`, data, {
                withCredentials: true,
            });

            // Ensuite, récupérer les infos de l'utilisateur connecté
            const meResponse = await axios.get(`${apiUri}/auth/me`, {
                withCredentials: true,
            });

            const userData = meResponse.data;

            // Appeler setUser du AuthContext
            setUser(userData);

            console.log("User logged in successfully", response.data);

            console.log("User logged in successfully", userData);

            navigate("/home", {
                state: {
                    successMessage: "Connexion réussie ! Bienvenue à Gamerz.",
                },
            });
        } catch (error) {
            console.error("Error during login:", error);
            const apiErrorMessage = "Une erreur est survenue. Veuillez réessayer.";
            setErrorMessage(apiErrorMessage);
        }
    };


    return (
        <div className="col-md-4 col-12 mt-4 mb-5">
            <h1 className="mb-3 text-center">Connexion</h1>

            {errorMessage && (
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm w-100">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        {...register("email")}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        {...register("password")}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                </div>

                <button type="submit" className="btn btn-dark w-100">Se connecter</button>
            </form>
        </div>
    );
}

export default LoginForm;
