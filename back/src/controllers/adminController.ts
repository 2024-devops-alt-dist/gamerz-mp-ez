import User from "../schemas/User";
import { Request, Response } from "express";

export const adminController = {
    async getPendingApplications(req: Request, res: Response): Promise<void> {
        const users = await User.find({ roles: ["ROLE_USER"], "applications.0": { $exists: true } });
        res.json(users);
    },

    async acceptApplication(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        user.roles = ["ROLE_USER", "ROLE_GAMERZ"];
        await user.save();

        res.json({ message: "Application accepted", user });
    },

    async rejectApplication(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
    
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
    
        user.roles = ["ROLE_USER", "ROLE_REJECTED"];
        await user.save();
    
        res.json({ message: "Application rejected and user role updated to ROLE_REJECTED" });
    }
    
};
