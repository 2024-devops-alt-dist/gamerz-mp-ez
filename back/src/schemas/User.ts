import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ["ROLE_USER"] },
    applications: [ApplicationSchema],
});

export default mongoose.model("User", UserSchema);
