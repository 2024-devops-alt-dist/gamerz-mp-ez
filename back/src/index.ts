import 'dotenv/config';
import mongoose from "mongoose";
import express from "express";
import cors from 'cors';
import session from "express-session";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import Message from "./schemas/Message";
import jwt from "jsonwebtoken";
import cookie from "cookie";

mongoose.set("debug", true);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const PORT = process.env.PORT || 5000;
const version = "v1";
const path = `/api/${version}`;

// Routes
import { router as authRouter } from "./routes/auth";
import { adminRouter } from './routes/admin';

// Middleware
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

// API routes
app.use(`${path}/auth`, authRouter);
app.use(`${path}/admin`, adminRouter);

// Socket.IO Authentication
io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
        return next(new Error("No cookies found"));
    }

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;
    if (!token) {
        return next(new Error("No token found"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (socket as any).user = decoded;
        next();
    } catch (err) {
        console.error("JWT verification failed", err);
        return next(new Error("Authentication error"));
    }
});

// Logique socket.io
io.on("connection", (socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user.username} (${user.userId})`);

    // Historique des messages
    Message.find()
        .sort({ timestamp: 1 })
        .limit(100)
        .populate("sender", "username")
        .then((messages) => {
            socket.emit("load_messages", messages);
        });

    // Actualisation lors des nouveaux messages
    socket.on("send_message", async ({ content }) => {
        try {
            const newMessage = new Message({
                sender: user.userId,
                content,
                timestamp: new Date(),
            });

            await newMessage.save();
            const populatedMessage = await newMessage.populate("sender", "username");

            io.emit("receive_message", populatedMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${user.username}`);
    });
});

// Connection à mongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connecté à MongoDB");

        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Erreur de connexion à MongoDB:", error);
    }
};

connectDB();
