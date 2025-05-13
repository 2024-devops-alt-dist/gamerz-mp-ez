import { Router } from "express";
import { adminController } from "../controllers/adminController";

export const adminRouter = Router();

// Accès Page
adminRouter.get("/applications", adminController.getPendingApplications);

// Colonne check candidature
adminRouter.post("/applications/:userId/accept", adminController.acceptApplication);
adminRouter.post("/applications/:userId/reject", adminController.rejectApplication);

// Colonne check users inscrits et bannissements
adminRouter.get("/gamerz", adminController.getGamerzUsers);
adminRouter.get("/rejected", adminController.getRejectedUsers);
adminRouter.post("/gamerz/:userId/ban", adminController.banUser);

// Topic
adminRouter.get("/topics", adminController.getAllTopics);
adminRouter.post("/topics", adminController.createTopic);
adminRouter.delete("/topics/:topicId", adminController.deleteTopic);
