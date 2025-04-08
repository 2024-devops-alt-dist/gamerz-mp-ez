import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: string;
    username: string;
    email: string;
    role: string[];
}

export const authenticateToken = (
    req: Request & { user?: JwtPayload },
    res: Response,
    next: NextFunction
): void => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: "Non autorisé. Token manquant." });
        return;
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        next();
    } catch (err) {
        res.status(403).json({ message: "Token invalide." });
        return;
    }
};
