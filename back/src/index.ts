import 'dotenv/config';
import mongoose from "mongoose";
import express from "express";
import { router as authRouter } from "./routes/auth";
import cors from 'cors';

mongoose.set("debug", true);

const app = express();
const PORT = process.env.PORT || 5000;

const version = "v1";
const path = `/api/${version}`;

app.use(cors({
    origin: 'http://localhost:5173'
}));

// Middleware pour parser le JSON
app.use(express.json());

// Utilisation des routes d'authentification
app.use(`${path}/auth`, authRouter);

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
