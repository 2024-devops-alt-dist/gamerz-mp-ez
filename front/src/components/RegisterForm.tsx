import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

// Définition du schéma Zod
const schema = z.object({
    username: z.string().min(5, "Le nom d'utilisateur doit avoir au moins 5 caractères"),
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
    confirmPassword: z.string(),
    content: z.string().min(20, "Votre motivation doit contenir au moins 20 caractères"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

// Définition du type TypeScript basé sur le schéma Zod
type FormData = z.infer<typeof schema>;

function RegisterForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const apiUri = import.meta.env.VITE_API_URI;
    console.log(apiUri);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axios.post(`${apiUri}/auth/register`, data);
            console.log("User registered successfully", response.data);

            // Redirect to home page with the success message
            navigate("/home", { state: { successMessage: "Inscription réussie ! Bienvenue à Gamerz." } });
        } catch (error) {
            console.error("Error during registration:", error);

            const apiErrorMessage = "Une erreur est survenue. Veuillez réessayer.";
            setErrorMessage(apiErrorMessage);
        }
    };

    return (
        <div className="col-md-4 col-12 mt-4 mb-5">
            <h2 className="mb-3 text-center">Rejoignez-nous dès maintenant !</h2>

            {errorMessage &&
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            }

            <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm w-100">

                <div className="mb-3">
                    <label className="form-label">Nom d'utilisateur</label>
                    <input
                        type="text"
                        className={`form-control ${errors.username ? "is-invalid" : ""}`}
                        {...register("username")}
                    />
                    {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                </div>

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

                <div className="mb-3">
                    <label className="form-label">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                        {...register("confirmPassword")}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Pourquoi voulez-vous rejoindre Gamerz ?</label>
                    <textarea
                        className={`form-control ${errors.content ? "is-invalid" : ""}`}
                        rows={4}
                        {...register("content")}
                    />
                    {errors.content && <div className="invalid-feedback">{errors.content.message}</div>}
                </div>

                <button type="submit" className="btn btn-dark w-100">S'inscrire</button>
            </form>
        </div>
    );
}

export default RegisterForm;
