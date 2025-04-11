import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Topic", TopicSchema);
