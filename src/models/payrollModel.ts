import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    salary: Number,
    month: String,
    generatedOn: Date,
  },
  { timestamps: true }
);

export const Payroll = mongoose.model("Payroll", payrollSchema);
