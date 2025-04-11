import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: false }
});

export default mongoose.model("Message", MessageSchema);