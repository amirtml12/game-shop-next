import mongoose, { Schema, models, model } from "mongoose";

const supportMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SupportMessage = models.SupportMessage || model("SupportMessage", supportMessageSchema);

export default SupportMessage;