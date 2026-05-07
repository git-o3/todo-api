import mongoose from "mongoose";

const Schema = mongoose.Schema

const todoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

// indexing user for faster pagination and filering
todoSchema.index({ user: 1, createdAt: -1 });

const Todo = mongoose.model("Todo", todoSchema);

export default Todo