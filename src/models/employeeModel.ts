import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    employeeId: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    profilePhotoUrl: { type: String },
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
