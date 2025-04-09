import User from "../schemas/User";
import { Request, Response } from "express";

export const adminController = {
    async getPendingApplications(req: Request, res: Response): Promise<void> {
        const users = await User.find({ "applications.status": "pending" });

        const pendingApps = users.flatMap(user =>
            user.applications
                .filter(app => app.status === "pending")
                .map(app => ({
                    _id: app._id,
                    content: app.content,
                    username: user.username,
                    email: user.email,
                    userId: user._id,
                }))
        );

        res.json(pendingApps);
    },

    async acceptApplication(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const app = user.applications.find(a => a.status === "pending");
        if (!app) {
            res.status(404).json({ error: "No pending application found" });
            return;
        }

        app.status = "accepted";
        user.roles = ["ROLE_USER", "ROLE_GAMERZ"];
        await user.save();

        res.json({ message: "Application accepted" });
    },

    async rejectApplication(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const app = user.applications.find(a => a.status === "pending");
        if (!app) {
            res.status(404).json({ error: "No pending application found" });
            return;
        }

        app.status = "rejected";
        user.roles = ["ROLE_USER", "ROLE_REJECTED"];
        await user.save();

        res.json({ message: "Application rejected" });
    }
};
