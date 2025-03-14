import 'dotenv/config';
import mongoose from "mongoose";
import express from "express";
import cors from 'cors';
import session from "express-session";
import cookieParser from "cookie-parser";

mongoose.set("debug", true);

const app = express();
const PORT = process.env.PORT || 5000;

const version = "v1";
const path = `/api/${version}`;

import { router as authRouter } from "./routes/auth";

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60, // 1 heure
        },
    })
);


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
