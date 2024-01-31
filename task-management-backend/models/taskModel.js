import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        ownerId: { type: String },
        title: { type: String, required: true },
        description: { type: String, required: true },
        dueDate: { type: String },
        priority: { type: String },
        taskType: { type: String },
        isCompleted: { 
            type: Boolean,
            default: false, 
        },
        progress: { type: Number },
        collaborateUsers: { type: Array},
    },
    { timestamps: true }
);

export const taskModel = mongoose.model("Task", taskSchema);