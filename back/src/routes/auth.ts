import { Router } from "express";
import { authController } from "../controllers/authController";

export const router = Router();

router.post("/", authController.post);
