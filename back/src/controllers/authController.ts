import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../schemas/User";
import { registerSchema } from "../validators/authValidator";
import dotenv from "dotenv";

dotenv.config();

export const authController = {
    register: async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate input
            const parsedData = registerSchema.parse(req.body);

            // Hash password
            const hashedPassword = await bcrypt.hash(parsedData.password, 10);

            // Create the new user
            const newUser = new User({
                username: parsedData.username,
                email: parsedData.email,
                password: hashedPassword,
                roles: ["ROLE_USER"],
                applications: [{
                    content: parsedData.content,
                    createdAt: new Date(),
                }],
            });

            // Save the user in DB
            await newUser.save();

            res.status(201).json({ message: "User and application registered successfully" });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : "Invalid data" });
        }
    },

    login: async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                res.status(401).json({ message: "Email ou mot de passe incorrect." });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ message: "Email ou mot de passe incorrect." });
                return;
            }

            // Create JWT token
            const token = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.roles
                },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );

            // Send token in a cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(200).json({ message: "Connexion réussie !" });
        } catch (error) {
            console.error("Erreur de connexion :", error);
            res.status(500).json({ message: "Erreur serveur." });
        }
    }
};
