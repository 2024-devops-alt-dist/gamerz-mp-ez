import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { isAdmin } from "../middleware/authMiddleware"; // optional if you want to restrict access

export const adminRouter = Router();

adminRouter.get("/applications", isAdmin, adminController.getPendingApplications);
adminRouter.post("/applications/:userId/accept", isAdmin, adminController.acceptApplication);
adminRouter.post("/applications/:userId/reject", isAdmin, adminController.rejectApplication);