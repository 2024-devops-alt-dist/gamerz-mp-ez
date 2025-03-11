import { registerUser } from "../controllers/authController";
import { Router } from "express";
export const router = Router();

router.post("/register", registerUser);
