import mongoose from "mongoose";

export interface ILeave extends mongoose.Document {
  employeeId: string;
  leaveType: "casual" | "sick" | "earned" | "short" | "breavement" | "compoff";
  dayType: "full" | "half";
  fromDate: Date;
  toDate: Date;
  reason: string;
  includeWeekend?: boolean;
  applyingTo: string;
  ccEmails: string[];
  attachment?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const LeaveSchema = new mongoose.Schema<ILeave>(
  {
    employeeId: { type: String, required: true },
    leaveType: { type: String, required: true },
    dayType: { type: String, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    includeWeekend: { type: Boolean, default: false },
    applyingTo: { type: String, required: true },
    ccEmails: [String],
    attachment: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const LeaveModel = mongoose.model<ILeave>("Leave", LeaveSchema);
