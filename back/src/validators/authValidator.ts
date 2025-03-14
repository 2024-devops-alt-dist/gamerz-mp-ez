import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(5, "Username must be at least 5 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    content: z.string().min(1, "Content cannot be empty"),
});
