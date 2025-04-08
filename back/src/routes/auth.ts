import { Router } from "express";
import { authController } from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddleware";

export const router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/me", authenticateToken, authController.me);