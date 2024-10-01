import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], // Reference to Task model
});

export default model("User", UserSchema);
