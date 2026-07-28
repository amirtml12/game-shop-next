import mongoose, { Schema, models, model } from "mongoose";

const supportMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const SupportMessage = models.SupportMessage || model("SupportMessage", supportMessageSchema);

export default SupportMessage;