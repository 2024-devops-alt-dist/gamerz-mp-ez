import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { registerSchema } from "../validators/authValidator";
import User from "../models/User";
import Application from "../models/Application";

export const authController = {
    post: async (req: Request, res: Response): Promise<void> => {
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
            });

            // Save the user in DB
            await newUser.save();

            // Create an associated application entry
            const newApplication = new Application({
                content: parsedData.content,
                user: newUser._id,
            });

            // Save the application entry in DB
            await newApplication.save();

            res.status(201).json({message: "User and application registered successfully"});
        } catch (error) {
            res.status(400).json({error: error instanceof Error ? error.message : "Invalid data"});
        }
    },
};
