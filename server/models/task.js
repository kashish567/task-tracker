import { Schema, model } from "mongoose";
const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do",
  },
  assignedUser: { type: Schema.Types.ObjectId, ref: "User" },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
});

export default model("Task", TaskSchema);
