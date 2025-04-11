import User from "../schemas/User";
import Topic from "../schemas/Topic";
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
    },

    async getGamerzUsers(req: Request, res: Response): Promise<void> {
        const users = await User.find({ roles: "ROLE_GAMERZ" }).select("username email _id");
        res.json(users);
    },
    
    async banUser(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
    
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
    
        user.roles = ["ROLE_USER", "ROLE_REJECTED"];
        await user.save();
    
        res.json({ message: "User banned successfully" });
    },

    async getAllTopics(req: Request, res: Response): Promise<void> {
        const topics = await Topic.find();
        res.json(topics);
    },

    // POST create new topic
    async createTopic(req: Request, res: Response): Promise<void> {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ error: "Topic name is required" });
            return;
        }

        const existing = await Topic.findOne({ name });
        if (existing) {
            res.status(400).json({ error: "Topic already exists" });
            return;
        }

        const newTopic = new Topic({ name });
        await newTopic.save();

        res.status(201).json(newTopic);
    },

    // DELETE a topic
    async deleteTopic(req: Request, res: Response): Promise<void> {
        const { topicId } = req.params;

        const deleted = await Topic.findByIdAndDelete(topicId);
        if (!deleted) {
            res.status(404).json({ error: "Topic not found" });
            return;
        }

        res.json({ message: "Topic deleted successfully" });
    },
};
