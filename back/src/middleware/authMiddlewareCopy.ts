import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../schemas/User";

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: "No token provided" });
            return;
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(decoded.id);

        if (!user || !user.roles.includes("ROLE_ADMIN")) {
            res.status(403).json({ error: "Access denied" });
            return;
        }

        // Authorized
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};
