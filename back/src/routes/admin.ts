import { Router } from "express";
import { adminController } from "../controllers/adminController";

export const adminRouter = Router();

adminRouter.get("/applications", adminController.getPendingApplications);
adminRouter.post("/applications/:userId/accept", adminController.acceptApplication);
adminRouter.post("/applications/:userId/reject", adminController.rejectApplication);