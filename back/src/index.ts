import 'dotenv/config';
import mongoose from "mongoose";
import express from "express";
import { router as authRouter } from "./routes/auth"; // Vérifie que le chemin est bon

mongoose.set("debug", true);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser le JSON
app.use(express.json());

// Utilisation des routes d'authentification
app.use("/api", authRouter); // Monte les routes sous "/api"

// Connexion à la base de données et démarrage du serveur
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("✅ Connecté à MongoDB");

        app.listen(PORT, () => {
            console.log(`🚀 Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Erreur de connexion à MongoDB:", error);
    }
};

connectDB();
