import { Schema, model, Document } from "mongoose";

export interface IContact extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  subject: string;
  message: string;
  createdAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ContactModel = model<IContact>("Contact", contactSchema);
